import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../utils/translations';
import { FaWhatsapp, FaInfoCircle, FaTag, FaImage } from 'react-icons/fa';

const WHATSAPP_NUMBER = '918122780990';

const Menu = () => {
  const { language } = useLanguage();

  // Fallback function: If an image fails to load, this replaces it with a placeholder
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    // Uses a reliable placeholder service with the text "Image Unavailable"
    e.target.src = "https://placehold.co/600x400/f3f4f6/9ca3af?text=Image+Coming+Soon";
  };

  const menuItems = [
    {
      id: 1,
      name: { en: 'Blouse', ta: 'ப்ளவுஸ்' },
      description: { en: 'Custom tailored blouse with perfect fit', ta: 'சிறந்த பொருத்தத்துடன் தனிப்பயனாக்கப்பட்ட ப்ளவுஸ்' },
      price: { en: '₹150 - ₹200', ta: '₹150 - ₹200' },
      // Image: Detailed fabric/embroidery close up
      image: 'https://images.pexels.com/photos/31768999/pexels-photo-31768999.jpeg'
    },
    {
      id: 2,
      name: { en: 'Saree Blouse', ta: 'சேலை ப்ளவுஸ்' },
      description: { en: 'Traditional saree blouse with modern designs', ta: 'நவீன வடிவமைப்புகளுடன் பாரம்பரிய சேலை ப்ளவுஸ்' },
      price: { en: '₹300 - ₹450', ta: '₹300 - ₹450' },
      // Image: Traditional Saree Texture/Drape
      image: 'https://images.pexels.com/photos/28943570/pexels-photo-28943570.jpeg'
    },
    {
      id: 3,
      name: { en: 'Chudithar', ta: 'சுடிதார்' },
      description: { en: 'Elegant Chudithar with top and bottom', ta: 'மேல் மற்றும் கீழ் உடையுடன் நேர்த்தியான சுடிதார்' },
      price: { en: '₹400 - ₹600', ta: '₹400 - ₹600' },
      // Image: Ethnic Wear / Kurta style
      image: 'https://www.freepik.com/premium-photo/beautiful-model-posing-confidently-traditional-dress-garden-fashion-shoot_330263024.htm#fromView=search&page=1&position=45&uuid=80351db9-e3f9-4e81-9174-88517969ed1e&query=chudithar'
    },
    {
      id: 4,
      name: { en: 'Frock', ta: 'ஃபிராக்' },
      description: { en: 'Comfortable and stylish frocks for all ages', ta: 'அனைத்து வயதினருக்கும் வசதியான மற்றும் ஸ்டைலான ஃபிராக்குகள்' },
      price: { en: '₹400 - ₹600', ta: '₹400 - ₹600' },
      // Image: Modern Dress / Fabric
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: { en: 'Langavoni', ta: 'லங்கா வோனி' },
      description: { en: 'Traditional half saree with beautiful designs', ta: 'அழகான டிசைன்களுடன் பாரம்பரிய லங்கா வோனி' },
      price: { en: '₹400 - ₹600', ta: '₹400 - ₹600' },
      // Image: Festive/Wedding attire context
      image: 'https://images.unsplash.com/photo-https://i.etsystatic.com/29135280/r/il/33d410/3068835981/il_fullxfull.3068835981_hrch.jpg-9a6fef564df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      name: { en: 'Alterations', ta: 'மாற்றங்கள்' },
      description: { en: 'Size adjustments and alterations', ta: 'அளவு சரிசெய்தல் மற்றும் மாற்றங்கள்' },
      price: { en: '₹50 - ₹100', ta: '₹50 - ₹100' },
      // Image: Sewing Machine / Tools
      image: 'https://images.unsplash.com/photo-1556905055-https://images.unsplash.com/photo-1673201229733-69d19c5c4a87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHRhaWxvcmluZyUyMGFsdGVyYXRpb258ZW58MHx8MHx8fDA%3Dhttps://unsplash.com/photos/person-holding-green-and-white-click-pen-H7qrRBQbwPUhttps://images.unsplash.com/photo-1629738224207-d967f40f7db3?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleWhatsApp = (item) => {
    const message = language === 'ta'
      ? `வணக்கம், நான் ${item.name[language]} பற்றி ஆர்டர் செய்ய விரும்புகிறேன். விலை: ${item.price[language]}`
      : `Hello, I would like to place an order for ${item.name[language]}. Price: ${item.price[language]}`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <div className="mb-16 text-center">
          <div className="inline-block p-2 px-4 bg-white rounded-full shadow-sm border border-gray-100 mb-4">
            <span className="text-accent-600 font-bold tracking-wider text-xs uppercase">
              {language === 'ta' ? 'எங்கள் சேவைகள்' : 'Our Services'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
            {language === 'ta' ? 'மெனு கார்டு' : 'Menu Card'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'ta' 
              ? 'உங்கள் பாணி மற்றும் வசதிக்காக வடிவமைக்கப்பட்ட எங்கள் பிரத்யேக தையல் சேவைகள்.' 
              : 'Explore our exclusive tailoring services designed for your style and comfort.'}
          </p>
        </div>

        {/* --- Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary-900/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                <img
                  src={item.image}
                  alt={item.name[language]}
                  onError={handleImageError}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-sm font-bold text-primary-700">
                   <FaTag className="text-xs" /> {item.price[language]}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {item.name[language]}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description[language]}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleWhatsApp(item)}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-xl" />
                    {language === 'ta' ? 'ஆர்டர் செய்' : 'Order on WhatsApp'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Note --- */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
            <div className="flex-shrink-0 text-blue-500 mt-1">
              <FaInfoCircle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                {language === 'ta' ? 'முக்கிய குறிப்பு' : 'Important Note'}
              </h3>
              <p className="text-blue-800/80 text-sm sm:text-base leading-relaxed">
                {language === 'ta'
                  ? 'விலைகள் பொருளின் வகை மற்றும் சிக்கலான தையல் வேலையைப் பொறுத்து மாறுபடும். துல்லியமான மதிப்பீட்டிற்கு எங்களைத் தொடர்பு கொள்ளவும்.'
                  : 'Prices mentioned above are indicative and may vary based on fabric type, lining requirements, and design complexity. Contact us for an exact quote.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Menu;