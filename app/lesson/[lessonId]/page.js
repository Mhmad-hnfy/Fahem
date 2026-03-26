"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Settings, 
  Maximize, 
  Volume2, 
  Play, 
  Pause,
  FileText,
  Download,
  ShieldCheck,
  Eye
} from "lucide-react";
import { useGlobalStore } from "@/lib/store";

// Extract Youtube ID
const getYoutubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function LessonDetailPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const lessonId = parseInt(unwrappedParams.lessonId, 10);

  const { lessons, chapters, currentUser, unlockedChapters, lessonViews, viewCounts, incrementLessonView, verifyAndUseCode } = useGlobalStore();

  const lesson = lessons.find(l => l.id === lessonId);
  const chapter = lesson ? chapters.find(c => c.id === parseInt(lesson.chapterId)) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Access Control & View Tracking
  const isUnlocked = (currentUser && chapter && (unlockedChapters || []).some(u => u.userId === currentUser.id && u.chapterId === chapter.id)) || (chapter && Number(chapter.price || 0) === 0);
  const userView = (viewCounts || []).find(v => v.userId === currentUser?.id && v.lessonId === lessonId);
  const currentViews = userView ? userView.count : 0;
  const maxViews = lesson?.maxViews || 5;

  const handleRedeemCode = (e) => {
    e.preventDefault();
    if (!redeemCode) return;
    setIsRedeeming(true);
    const result = verifyAndUseCode(redeemCode, currentUser?.id);
    if (result.success) {
        alert(result.message);
        setRedeemCode("");
        // Immediately track the first view of the recharged session
        incrementLessonView(currentUser?.id, lessonId);
    } else {
        alert(result.message);
    }
    setIsRedeeming(false);
  };

  // YouTube API Integration for Custom Player
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("");
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lessonId || !lesson?.youtubeLink || !isUnlocked) return;

    // Load YouTube API script if not present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const checkAndInit = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => initPlayer();
      }
    };

    checkAndInit();

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); playerRef.current = null; } catch(e) {}
      }
    };
  }, [lessonId, lesson?.youtubeLink, isUnlocked]);

  const initPlayer = () => {
    if (!lesson?.youtubeLink || !isUnlocked) return;
    const videoId = getYoutubeID(lesson.youtubeLink);
    if (!videoId) return;

    // Clean up existing player before re-init
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch(e) {}
    }

    const newPlayer = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        fs: 1,
        disablekb: 1,
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          playerRef.current = event.target;
          setDuration(event.target.getDuration());
          setQualityLevels(event.target.getAvailableQualityLevels());
          setCurrentQuality(event.target.getPlaybackQuality());
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          if (event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.BUFFERING) {
            const levels = event.target.getAvailableQualityLevels();
            if (levels && levels.length > 0) {
              setQualityLevels(levels);
              setCurrentQuality(event.target.getPlaybackQuality());
            }
          }
        }
      }
    });
  };

  // Update progress bar
  useEffect(() => {
    if (isPlaying && player && duration > 0) {
      const interval = setInterval(() => {
        try {
            const curr = player.getCurrentTime();
            setProgress((curr / duration) * 100);
        } catch(e) {}
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, player, duration]);

  useEffect(() => {
    if (player) {
      player.setPlaybackRate(playbackSpeed);
    }
  }, [playbackSpeed, player]);

  useEffect(() => {
    if (isUnlocked && currentUser && lessonId) {
      // Increment view only if under limit
      if (currentViews < maxViews) {
         incrementLessonView(currentUser.id, lessonId);
      }
    }
  }, [isUnlocked, lessonId]);

  // Moving Watermark Effect
  useEffect(() => {
    if (isUnlocked) {
        const interval = setInterval(() => {
            setWatermarkPos({
                top: Math.floor(Math.random() * 80) + 10,
                left: Math.floor(Math.random() * 80) + 10
            });
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && showControls) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, showControls]);

  const handleTouchPlayer = () => {
    setShowControls(prev => !prev);
  };

  if (!lessons || (lessons.length === 0 && !lesson)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white" dir="rtl">جاري التحميل...</div>;
  }

  if (!lesson || !chapter) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white" dir="rtl">
            <div className="text-center">
                <p className="text-xl font-bold mb-4">الدرس غير موجود</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-red-600 rounded-xl font-bold">رجوع</button>
            </div>
        </div>
    );
  }

  if (!isUnlocked) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8 text-center" dir="rtl">
            <div>
                <ShieldCheck className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-black mb-4">الدخول مرفوض</h1>
                <p className="text-slate-400 mb-8 font-bold">يجب تفعيل الباب أولاً لتتمكن من مشاهدة هذا الدرس</p>
                <button onClick={() => router.back()} className="px-8 py-3 bg-red-600 rounded-2xl font-black">العودة للباب</button>
            </div>
        </div>
    );
  }

  if (currentViews >= maxViews) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8 text-center" dir="rtl">
            <div className="max-w-md w-full">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                    <Eye className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-3xl font-black mb-4">انتهت عدد المشاهدات</h1>
                <p className="text-slate-400 mb-8 font-bold">لقد استنفدت الحد الأقصى لمشاهدة هذا الفيديو ({maxViews} مشاهدات). يمكنك إدخال كود جديد لتجديد المشاهدات.</p>
                
                <form onSubmit={handleRedeemCode} className="space-y-4 mb-8">
                    <input 
                        type="text" 
                        placeholder="ادخل كود التجديد هنا..." 
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-xl font-mono font-black text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-slate-600"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={isRedeeming}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl font-black shadow-lg shadow-red-900/20 hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50"
                    >
                        {isRedeeming ? "جاري التحقق..." : "تفعيل وشحن المشاهدات الآن"}
                    </button>
                </form>

                <button onClick={() => router.back()} className="text-slate-500 hover:text-white font-bold transition-colors">العودة للخلف</button>
            </div>
        </div>
    );
  }

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
      setShowControls(true);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!player) return;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    player.seekTo(newTime, true);
    setProgress(newProgress);
  };

  const toggleFullScreen = (e) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    
    const isActuallyFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    
    if (!isActuallyFull) {
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen();
      else if (containerRef.current.webkitRequestFullscreen) containerRef.current.webkitRequestFullscreen();
      else if (containerRef.current.msRequestFullscreen) containerRef.current.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error("Exit fullscreen error", err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const val = parseInt(e.target.value);
    setVolume(val);
    if (player) {
      player.setVolume(val);
      player.unMute();
      setIsMuted(val === 0);
    }
  };

  const handleQualityChange = (e, q) => {
    e.stopPropagation();
    if (player) {
      player.setPlaybackQuality(q);
      setCurrentQuality(q);
    }
  };

  if (!lesson || !chapter) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white" dir="rtl">الدرس غير موجود</div>;
  }

  if (!isUnlocked) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8 text-center" dir="rtl">
            <div>
                <ShieldCheck className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-black mb-4">الدخول مرفوض</h1>
                <p className="text-slate-400 mb-8 font-bold">يجب تفعيل الباب أولاً لتتمكن من مشاهدة هذا الدرس</p>
                <button onClick={() => router.back()} className="px-8 py-3 bg-red-600 rounded-2xl font-black">العودة للباب</button>
            </div>
        </div>
    );
  }

  if (currentViews >= maxViews) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8 text-center" dir="rtl">
            <div className="max-w-md w-full">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                    <Eye className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-3xl font-black mb-4">انتهت عدد المشاهدات</h1>
                <p className="text-slate-400 mb-8 font-bold">لقد استنفدت الحد الأقصى لمشاهدة هذا الفيديو ({maxViews} مشاهدات). يمكنك إدخال كود جديد لتجديد المشاهدات.</p>
                
                <form onSubmit={handleRedeemCode} className="space-y-4 mb-8">
                    <input 
                        type="text" 
                        placeholder="ادخل كود التجديد هنا..." 
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-xl font-mono font-black text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-slate-600"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={isRedeeming}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl font-black shadow-lg shadow-red-900/20 hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50"
                    >
                        {isRedeeming ? "جاري التحقق..." : "تفعيل وشحن المشاهدات الآن"}
                    </button>
                </form>

                <button onClick={() => router.back()} className="text-slate-500 hover:text-white font-bold transition-colors">العودة للخلف</button>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pt-24 lg:pt-32 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-3 gap-8">
        
        {/* Left: Video Player & PDF (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <ArrowRight className="w-6 h-6 rotate-180" />
                 </button>
                 <div>
                    <h1 className="text-2xl font-black">{lesson.name}</h1>
                    <p className="text-slate-400 text-sm font-bold">{chapter.name}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-xs font-black">
                 <ShieldCheck className="w-4 h-4" />
                 اتصال آمن بمتصفح خاص
              </div>
           </div>

           {/* Custom Premium Video Player */}
           <div ref={containerRef} className="relative aspect-video bg-black rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/5 group/player z-[2000]">
              <div id="youtube-player" className="w-full h-full pointer-events-none"></div>

              {/* Watermark Overlay */}
              <div 
                className="absolute pointer-events-none text-white/20 text-[8px] md:text-sm font-black select-none z-50 transition-all duration-1000 ease-in-out whitespace-nowrap text-center"
                style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
              >
                {currentUser?.name} <br /> {currentUser?.phone} <br /> {new Date().toLocaleTimeString('ar-EG')}
              </div>

              {/* Custom Controls Overlay */}
              <div className="absolute inset-0 bg-transparent z-[40]" onContextMenu={(e) => e.preventDefault()} onClick={handleTouchPlayer}>
                 {/* Protection Layer covers the center to prevent direct iframe clicks, but controls are accessible */}
                 <div className="absolute inset-0 bg-transparent"></div>

                 {/* Play/Pause Large indicator on tap */}
                 {!showControls && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 animate-ping">
                           <Play className="w-10 h-10 text-white fill-current" />
                        </div>
                    </div>
                 )}

                 {/* Controls Bar */}
                 <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 md:p-6 transition-all duration-300 z-[60] ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    
                    {/* Progress Bar */}
                    <div className="mb-3 md:mb-4 relative group/progress">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-red-600 transition-all group-hover/progress:h-2"
                        />
                        <div className="absolute top-1/2 left-0 h-1.5 bg-red-600 rounded-full pointer-events-none group-hover/progress:h-2 -translate-y-1/2" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 md:gap-6">
                            <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors transform active:scale-90">
                                {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />}
                            </button>
                            
                            <div className="hidden sm:flex items-center gap-3 group/volume">
                                <Volume2 className="w-5 h-5 text-white/70" />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-16 lg:w-32 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                />
                            </div>

                            <div className="text-white/70 text-[10px] md:text-sm font-bold font-mono">
                                {player ? Math.floor(player.getCurrentTime() / 60) : "00"}:
                                {player ? String(Math.floor(player.getCurrentTime() % 60)).padStart(2, '0') : "00"} 
                                <span className="hidden md:inline"> / </span>
                                <span className="hidden md:inline">
                                    {player ? Math.floor(duration / 60) : "00"}:
                                    {player ? String(Math.floor(duration % 60)).padStart(2, '0') : "00"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Quality Selector */}
                            <div className="flex gap-1 px-1.5 py-1 bg-white/10 rounded-xl backdrop-blur-md border border-white/5 overflow-x-auto max-w-[80px] md:max-w-none">
                                {qualityLevels && qualityLevels.length > 0 ? (
                                    qualityLevels.filter(q => q !== 'auto').slice(0, 4).map(q => (
                                        <button 
                                            key={q}
                                            onClick={(e) => handleQualityChange(e, q)}
                                            className={`px-1.5 h-6 rounded-lg text-[8px] md:text-[10px] font-black transition-all flex-shrink-0 ${currentQuality === q ? "bg-red-600 text-white shadow-lg" : "text-white/50 hover:text-white"}`}
                                        >
                                            {q.replace('hd', '').replace('small', '240p').replace('medium', '360p').replace('large', '480p')}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-[8px] px-1 text-white/30 font-bold">جاري...</div>
                                )}
                            </div>

                            <div className="flex gap-1 px-1.5 py-1 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                                {[1, 1.5, 2].map(s => (
                                    <button 
                                        key={s}
                                        onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(s); }}
                                        className={`w-7 h-6 rounded-lg text-[8px] md:text-[10px] font-black transition-all ${playbackSpeed === s ? "bg-red-600 text-white shadow-lg" : "text-white/50 hover:text-white"}`}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>
                            <button onClick={toggleFullScreen} className="text-white/70 hover:text-white transition-colors p-1">
                                <Maximize className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Lesson Assets */}
           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[40px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-black flex items-center gap-2">
                    <FileText className="w-6 h-6 text-red-500" />
                    المصادر الملحقة بالدرس
                 </h3>
                 {lesson.pdfFile && (
                    <a 
                      href={lesson.pdfFile} 
                      download={`${lesson.name}-fahem.pdf`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold border border-white/10"
                    >
                       <Download className="w-4 h-4" />
                       تحميل PDF
                    </a>
                 )}
              </div>
              
              {lesson.pdfFile ? (
                <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                      <FileText className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <p className="font-bold">ملخص المحاضرة والخرائط الذهنية</p>
                      <p className="text-xs text-slate-500">اضغط للتحميل أو العرض</p>
                   </div>
                    <a 
                      href={lesson.pdfFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors"
                    >
                      عرض
                    </a>
                </div>
              ) : (
                <p className="text-slate-500 font-bold text-center py-4">لا توجد ملفات مرفقة لهذا الدرس</p>
              )}
           </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="mt-8 lg:mt-0 space-y-6">
           <div className="bg-gradient-to-br from-red-600 to-rose-700 p-8 rounded-[40px] shadow-xl shadow-red-950/20 relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-2xl font-black mb-2">معلومات المشاهدة</h2>
                 <p className="text-red-100 text-sm mb-6">احرص على التركيز أثناء الشرح</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                       <span className="text-sm font-bold opacity-70">عدد المشاهدات</span>
                       <span className="font-black text-xl">{currentViews}/{maxViews}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                       <span className="text-sm font-bold opacity-70">سرعة التشغيل</span>
                       <div className="flex gap-2">
                          {[1, 1.25, 1.5, 2].map(s => (
                             <button 
                                key={s}
                                onClick={() => setPlaybackSpeed(s)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${playbackSpeed === s ? "bg-white text-red-600 shadow-lg" : "bg-black/20 hover:bg-black/30"}`}
                             >
                                {s}x
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           </div>

           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[40px] space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                 <Eye className="w-5 h-5 text-blue-400" />
                 تعليمات هامة
              </h3>
              <ul className="space-y-4 text-sm font-bold text-slate-400 list-disc pr-4">
                 <li>يمنع منعاً باتاً تصوير الشاشة أو محاولة تسجيل الفيديو.</li>
                 <li>كافة الفيديوهات مراقبة ومحمية بعلامات مائية شخصية.</li>
                 <li>سيتم حظر أي حساب يشارك بيانات دخوله مع الآخرين.</li>
                 <li>يمكنك تحميل ملخص الدرس فقط ولا يمكن تحميل الفيديو.</li>
              </ul>
           </div>
        </div>

      </div>
    </main>
  );
}
