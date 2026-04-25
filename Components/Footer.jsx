import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
    const linkSections = [
        {
            title: "روابط سريعة",
            links: [
                { name: "الرئيسية", href: "/" },
                { name: "الأكثر مبيعاً", href: "#" },
                { name: "العروض والتخفيضات", href: "#" },
                { name: "تواصل معنا", href: "#" },
                { name: "الأسئلة الشائعة", href: "#" }
            ]
        },
        {
            title: "تحتاج مساعدة؟",
            links: [
                { name: "معلومات التوصيل", href: "#" },
                { name: "سياسة الاسترجاع", href: "#" },
                { name: "طرق الدفع", href: "#" },
                { name: "تتبع طلبك", href: "#" },
                { name: "مركز المساعدة", href: "#" }
            ]
        },
        {
            title: "القانونية",
            links: [
                { name: "سياسة الخصوصية", href: "#" },
                { name: "شروط الاستخدام", href: "#" },
                { name: "سياسة الكوكيز", href: "#" }
            ]
        }
    ];

    const socialLinks = [
        { icon: <Facebook size={20} />, href: "#", color: "hover:bg-white hover:text-red-600" },
        { icon: <Twitter size={20} />, href: "#", color: "hover:bg-white hover:text-red-600" },
        { icon: <Instagram size={20} />, href: "#", color: "hover:bg-white hover:text-red-600" },
        { icon: <Youtube size={20} />, href: "#", color: "hover:bg-white hover:text-red-600" }
    ];

    return (
        <footer className="relative bg-gradient-to-b from-red-900 to-red-950 text-red-50 pt-16 pb-8 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent opacity-30"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-500/20">
                                ف
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">فاهم</span>
                        </div>
                        <p className="text-red-100/80 leading-relaxed mb-8 text-sm md:text-base font-medium">
                            منصة فاهم هي طريقك نحو التميز والنجاح. نقدم أفضل الكورسات التعليمية والتدريبية بأحدث الوسائل التكنولوجية لتطوير مهاراتك.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a 
                                    key={index} 
                                    href={social.href}
                                    className={`w-10 h-10 rounded-full bg-red-800/40 flex items-center justify-center transition-all duration-300 border border-red-700/50 ${social.color} hover:scale-110 active:scale-95`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {linkSections.map((section, index) => (
                            <div key={index}>
                                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                                    {section.title}
                                    <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-rose-400 rounded-full"></span>
                                </h3>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a 
                                                href={link.href} 
                                                className="group flex items-center gap-2 text-sm md:text-base hover:text-white transition-colors duration-300 font-medium"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <div className="col-span-1">
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            اشترك في النشرة البريدية
                            <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-rose-400 rounded-full"></span>
                        </h3>
                        <p className="text-sm text-red-100/70 mb-6 font-medium">
                            احصل على آخر التحديثات والعروض الحصرية مباشرة في بريدك الإلكتروني.
                        </p>
                        <form className="relative">
                            <input 
                                type="email" 
                                placeholder="بريدك الإلكتروني" 
                                className="w-full bg-red-800/30 border border-red-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-rose-400 transition-colors text-white placeholder:text-red-200/50"
                            />
                            <button 
                                type="submit"
                                className="absolute left-1.5 top-1.5 bg-rose-500 hover:bg-rose-400 text-white p-1.5 rounded-lg transition-all duration-300 group shadow-lg shadow-rose-500/20"
                            >
                                <Send size={20} className="group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform" />
                            </button>
                        </form>
                        
                        <div className="mt-8 pt-8 border-t border-red-800/50">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-red-800/40 flex items-center justify-center text-rose-300 border border-red-700/50">
                                        <Phone size={14} />
                                    </div>
                                    <span className="font-medium text-red-50/90">  01034654360⁩</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-red-800/40 flex items-center justify-center text-rose-300 border border-red-700/50">
                                        <Mail size={14} />
                                    </div>
                                    <span className="font-medium text-red-50/90">fahem.edu5@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-red-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs md:text-sm text-red-200/60 text-center md:text-right font-medium">
                        جميع الحقوق محفوظة © {new Date().getFullYear()} <span className="text-white font-bold underline decoration-rose-500 decoration-2 underline-offset-4">منصة فاهم</span>. تم التطوير بكل ❤️
                    </p>
                    <div>
                        <a href="https://www.facebook.com/mohamed.hanafy.446285?locale=ar_AR">
                           
                            <h1 className="text-white font-medium text-sm">Code By Mohamed Hanafy</h1>
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 brightness-0 invert opacity-50 hover:opacity-100 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 brightness-0 invert opacity-50 hover:opacity-100 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 brightness-0 invert opacity-50 hover:opacity-100 transition-all" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

