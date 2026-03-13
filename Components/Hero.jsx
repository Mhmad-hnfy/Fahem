"use client";
import React, { useState } from "react";
import { PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { AspectRatio } from "@/Components/ui/aspect-ratio";

function Hero() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  
  return (
    <div className="relative isolate min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-20">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-50 via-white to-orange-50/30 -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-right relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/60 border border-red-200 text-red-700 text-sm font-bold shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              منصة التعليم الرائدة في العالم العربي
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900">
              طريقك للتفوق والنجاح <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 leading-normal">
                يبدأ من هنا...
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              اكتشف آفاقاً جديدة للتعلم مع أقوى الدورات التعليمية المصممة خصيصاً
              لطلاب الثانوية العامة لتطوير مهاراتك . تعلم في أي وقت ومن أي مكان
              وبأعلى جودة. مع فاهم خاليك فاهم 😉
            </p>
              
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg">
                ابدأ رحلتك التعليمية الآن
              </button>
              </a>
              <a href="/courses">
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm border-2 border-slate-100 hover:border-red-100 hover:text-red-600 transition-all duration-300 text-lg flex items-center justify-center gap-3">
                تصفح المسارات المتوفرة
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-10 text-sm font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-slate-900">+50 ألف</div>
                  <div className="text-xs text-slate-500">طالب مسجل</div>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-slate-900">+120</div>
                  <div className="text-xs text-slate-500">محتوى معتمد</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative mt-12 lg:mt-0 flex justify-center z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-300 to-rose-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
            <img
              src="/education_hero.png"
              alt="Fahem Platform Hero Visuals"
              className="relative w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl object-cover hover:scale-[1.02] transition-transform duration-500 animate-float"
            />
          </div>
        </div>
      </main>

      <div className="relative z-10 lg:-mt-20 px-4 pb-20 max-w-7xl mx-auto w-full mt-10 lg:mt-4">
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 overflow-hidden relative">
          <div className="flex-1 space-y-6 text-center md:text-right">
            <div className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider uppercase">
              الابتكار في التعلم
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1]">
              أعرف نظامك معانا
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              فيديو توضيحى علشان تعرف نظامك معانا <br />
              اذاى تذاكر واذاى تحل
              <br />
              واذاى تراجع واذاى تلم المنهج <br /> و اذاى تحصل على الكورسات و
              الفيديوهات
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    className="w-12 h-12 rounded-full border-4 border-white object-cover"
                    alt="User"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">
                  أكثر من 5000 طالب
                </span>
                <span className="text-xs text-gray-400">
                  خليك مع فاهم عشان تبقى فاهم 😉
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex-1 w-full relative group cursor-pointer"
            onClick={() => setShowVideoModal(true)}
          >
            <img
              src="/education_hero.png"
              className="w-full rounded-3xl shadow-2xl transition duration-700 group-hover:scale-[1.02]"
              alt="showcase"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-black/10 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full backdrop-blur-md flex items-center justify-center shadow-xl animate-bounce group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <PlayCircle className="text-red-600 w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-gray-800 flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Showcase Video</DialogTitle>
          </DialogHeader>
          <div className="relative group bg-black">
            <AspectRatio ratio={16 / 9} className="bg-black">
              <iframe
                src={`https://www.youtube.com/embed/5jhwxSI939o?autoplay=1&modestbranding=1&rel=0`}
                title="YouTube video player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Hero;
