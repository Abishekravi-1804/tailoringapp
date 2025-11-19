import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCut, FaRulerCombined, FaPalette, FaCheckCircle } from 'react-icons/fa';
import { GiSewingMachine } from 'react-icons/gi';

// Language context imports
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../utils/translations';

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const featureList = [
    { 
      icon: <FaCut />, 
      title: t.feature1Title || "Precision Cutting", 
      desc: t.feature1Desc || "Exact measurements for the perfect fit.",
      colorClass: "bg-primary-100 text-primary-700"
    },
    { 
      icon: <FaRulerCombined />, 
      title: t.feature2Title || "Custom Sizing", 
      desc: t.feature2Desc || " tailored specifically to your body type.",
      colorClass: "bg-accent-100 text-accent-700"
    },
    { 
      icon: <FaPalette />, 
      title: t.feature3Title || "Modern Styles", 
      desc: t.feature3Desc || "Choose from hundreds of fabrics and colors.",
      colorClass: "bg-primary-50 text-accent-600"
    },
  ];

  const howItWorksSteps = [
    { num: '01', title: t.step1Title || "Consultation", desc: t.step1Desc || "Book a session with our expert stylists." },
    { num: '02', title: t.step2Title || "Measurement", desc: t.step2Desc || "We take your precise measurements." },
    { num: '03', title: t.step3Title || "Delivery", desc: t.step3Desc || "Receive your custom outfit in days." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden w-full">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 w-full">
        {/* Background Blobs (Fixed positioning) */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 left-0 -z-10 -translate-x-1/3 w-72 h-72 bg-accent-200 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <div className="text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-800 text-sm font-bold tracking-wide">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary-600 animate-pulse"></span>
                NEW COLLECTION
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {t.welcome || "Stitch Your"} 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  Perfect Style
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t.subtitle || "Experience the luxury of perfectly fitted clothes delivered to your doorstep."}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 group"
                >
                  {t.getStarted || "Get Started"} 
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-primary-50 text-gray-700 border border-gray-200 hover:border-primary-200 rounded-xl font-bold text-lg transition-all flex items-center justify-center"
                >
                  View Designs
                </Link>
              </div>
              
              <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-gray-500 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary-500 text-lg" /> Custom Fit
                </span>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary-500 text-lg" /> Premium Fabric
                </span>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:h-[600px]">
              {/* Orange/Pink Background Shape behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-accent-200 rounded-[2.5rem] transform rotate-6 scale-95 -z-10"></div>
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100">
                 {/* Using a very specific, reliable Unsplash ID for fashion */}
                 <img 
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Tailoring and Fashion" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 max-w-xs z-20 hidden sm:block">
                    <p className="font-bold text-gray-800 text-sm">Expert Tailors</p>
                    <p className="text-xs text-gray-500">Crafting elegance since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. Features Section --- */}
      <section className="py-20 bg-gray-50/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-accent-600 tracking-widest uppercase mb-2">Why Choose Us</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.whyChooseUs || "Craftsmanship"}</h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600">{t.whyChooseUsDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureList.map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.colorClass} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. How It Works (Zig-Zag) --- */}
      <section className="py-24 relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.howItWorks || "How It Works"}</h2>
          </div>

          <div className="relative space-y-16 lg:space-y-24">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-100 via-accent-100 to-primary-100 -translate-x-1/2 rounded-full z-0"></div>

            {howItWorksSteps.map((step, index) => {
              const isEven = index % 2 === 1;
              return (
                <div key={index} className={`relative flex flex-col items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:gap-24 z-10`}>
                  
                  {/* Step Number Bubble */}
                  <div className="mb-6 lg:mb-0 flex-shrink-0">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white border-[6px] border-primary-50 text-primary-600 font-extrabold text-2xl lg:text-3xl rounded-full flex items-center justify-center shadow-xl relative z-10">
                      {step.num}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className={`w-full lg:w-1/2 text-center ${isEven ? 'lg:text-right' : 'lg:text-left'} bg-white lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none shadow-md lg:shadow-none border border-gray-100 lg:border-none`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Empty Space for Grid Balance */}
                  <div className="hidden lg:block lg:w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 4. CTA Section --- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-6xl mx-auto relative bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Simplified Backgrounds (No Custom Animation) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600 rounded-full blur-[80px] opacity-20"></div>

          <div className="relative px-6 py-20 sm:px-12 sm:py-24 text-center z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 text-primary-400 ring-1 ring-white/20">
              <GiSewingMachine className="text-4xl" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              {t.readyToStart || "Ready to Start?"}
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
              {t.readyToStartDesc || "Join thousands of happy customers."}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-900/50 flex items-center justify-center gap-2"
              >
                {t.signUpToday || "Sign Up"} <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;