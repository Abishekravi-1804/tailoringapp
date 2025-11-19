import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaWhatsapp, FaCheckCircle, FaStar, FaCut 
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

// Keep your profile picture import
import profilePic from '../../assets/tailor-profile.jpg';

const TailorProfile = () => {
  const { language } = useLanguage();

  const tailorInfo = {
    name: { en: 'Devi', ta: 'தேவி' },
    role: { en: 'Professional Tailor & Designer', ta: 'தொழில்முறை தையல்காரர் & வடிவமைப்பாளர்' },
    experience: { en: '15+ Years Experience', ta: '15+ ஆண்டுகள் அனுபவம்' },
    description: {
      en: 'Expert in women\'s tailoring with a specialization in traditional and modern designs. We provide quality stitching with attention to detail and a perfect fit that compliments your style.',
      ta: 'பாரம்பரிய மற்றும் நவீன வடிவமைப்புகளில் நிபுணத்துவம் கொண்ட பெண்கள் தையலில் நிபுணர். ஒவ்வொரு உடையிலும் நுணுக்கமான கவனம் மற்றும் சிறந்த பொருத்தத்துடன் கூடிய தரமான தையலை நாங்கள் வழங்குகிறோம்.'
    },
    specialties: [
      { en: 'Blouse Stitching', ta: 'ப்ளவுஸ் தைத்தல்' },
      { en: 'Saree Blouse', ta: 'சேலை ப்ளவுஸ்' },
      { en: 'Churidar & Salwar', ta: 'சுரிதார் மற்றும் சல்வார்' },
      { en: 'Lehenga & Bridal Wear', ta: 'லெஹங்கா மற்றும் திருமண உடை' },
      { en: 'Alterations & Repairs', ta: 'மாற்றங்கள் மற்றும் பழுதுபார்ப்பு' },
      { en: 'Kids Wear', ta: 'குழந்தைகள் உடை' }
    ],
    contact: {
      phone: '+918122780990',
      email: 'devithaiyalagam@gmail.com',
      whatsapp: '918122780990',
      instagram: 'devithaiyalagam',
      address: {
        en: '82/1 Shanmugarajapuram, 2nd Cross Street, Selvapuram, Coimbatore - 641026',
        ta: '82/1, சண்முகராஜபுரம், 2வது குறுக்கு தெரு, செல்வபுரம், கோயம்புத்தூர் - 641026'
      },
      timings: {
        en: 'Mon-Sat: 9:00 AM - 7:00 PM',
        ta: 'திங்கள்-சனி: காலை 9:00 - மாலை 7:00'
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const actions = [
    { 
      label: language === 'ta' ? 'வாட்ஸ்அப்' : 'WhatsApp',
      icon: <FaWhatsapp className="text-xl" />, 
      onClick: () => window.open(`https://wa.me/${tailorInfo.contact.whatsapp}`, '_blank'),
      // Updated col-span to 1 for the new 2-column grid
      className: 'bg-[#25D366] hover:bg-[#128C7E] text-white col-span-1' 
    },
    { 
      label: language === 'ta' ? 'அழைக்க' : 'Call',
      icon: <FaPhone className="text-lg" />, 
      onClick: () => window.open(`tel:${tailorInfo.contact.phone}`),
      className: 'bg-blue-500 hover:bg-blue-600 text-white col-span-1' // Added col-span-1
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- Banner --- */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary-600 via-orange-500 to-accent-600 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-24 z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column --- */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl relative group z-10 overflow-visible">
              <div className="p-6 text-center pt-16 relative">
                
                {/* Profile Image */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img 
                      src={profilePic} 
                      alt={tailorInfo.name.en}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center z-20">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    {tailorInfo.name[language]} 
                    <MdVerified className="text-blue-500 text-xl" />
                  </h2>
                  <p className="text-primary-600 font-medium text-sm mb-1">{tailorInfo.role[language]}</p>
                  
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-amber-100">
                    <FaStar className="text-amber-400" /> {tailorInfo.experience[language]}
                  </div>
                </div>

                {/* Action Buttons - Changed to grid-cols-2 */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  {actions.map((action, idx) => (
                    <button 
                      key={idx}
                      onClick={action.onClick}
                      className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-sm hover:shadow-md active:scale-95 ${action.className}`}
                    >
                      {action.icon}
                      <span className="text-xs font-semibold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info List */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 space-y-3 rounded-b-3xl">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <FaMapMarkerAlt className="mt-1 text-primary-500 flex-shrink-0" />
                  <span>{tailorInfo.contact.address[language]}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaClock className="text-primary-500 flex-shrink-0" />
                  <span>{tailorInfo.contact.timings[language]}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaEnvelope className="text-primary-500 flex-shrink-0" />
                  <span className="break-all">{tailorInfo.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Google Maps Link */}
            <div className="bg-white p-1 rounded-2xl shadow-lg cursor-pointer transform transition hover:scale-[1.02]" onClick={() => window.open('https://goo.gl/maps/YOUR_ACTUAL_LINK', '_blank')}>
              <div className="bg-blue-50 h-32 rounded-xl flex items-center justify-center relative overflow-hidden">
                 {/* Simulating a map background */}
                 <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                 <div className="text-center z-10">
                    <FaMapMarkerAlt className="text-4xl text-red-500 mx-auto mb-2 drop-shadow-md" />
                    <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
                      {language === 'ta' ? 'வரைபடத்தில் பார்க்க' : 'View on Google Maps'}
                    </span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* --- Right Column --- */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8 pt-4 sm:pt-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative">
               <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <span className="bg-primary-100 text-primary-600 p-2 rounded-lg"><FaCut /></span>
                 {language === 'ta' ? 'எங்களைப் பற்றி' : 'About Me'}
               </h3>
               <p className="text-gray-600 leading-relaxed text-lg">
                 {tailorInfo.description[language]}
               </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-5 px-2">
                {language === 'ta' ? 'எங்கள் சிறப்பு சேவைகள்' : 'Our Specialties'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tailorInfo.specialties.map((specialty, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-primary-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shadow-sm">
                      <FaCheckCircle />
                    </div>
                    <span className="font-semibold text-gray-700">{specialty[language]}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">
                  {language === 'ta' ? 'உங்கள் ஆடையை வடிவமைக்க தயாரா?' : 'Ready to design your outfit?'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {language === 'ta' ? 'இன்றே எங்களை தொடர்பு கொள்ளவும்' : 'Book an appointment today'}
                </p>
                <button 
                  onClick={() => window.open(`tel:${tailorInfo.contact.phone}`)}
                  className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {language === 'ta' ? 'இப்போது அழைக்கவும்' : 'Call Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TailorProfile;