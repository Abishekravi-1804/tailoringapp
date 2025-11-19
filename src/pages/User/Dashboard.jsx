import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../utils/translations'

// Import icons from react-icons
import { FaBookOpen, FaUser, FaClipboardList, FaPhone, FaBoxOpen } from 'react-icons/fa'
// Import the animation library
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { language } = useLanguage()
  const t = translations[language]

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // This will make the cards appear one after another
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 -z-10"></div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-16 text-center"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4 pb-2">
          {language === 'ta' ? 'வரவேற்பு' : 'Welcome'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {language === 'ta' ? 'எங்கள் தையல் சேவைகளின் உலகத்தைக் கண்டறியவும்.' : 'Discover the world of our tailoring services.'}
        </p>
      </motion.div>

      {/* Main Navigation Cards with animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/user/menu"
            className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group hover:shadow-2xl hover:shadow-primary-500/20 block"
          >
            <div className="text-center">
              <FaBookOpen className="w-16 h-16 mx-auto mb-6 text-primary-500 group-hover:text-primary-600 transition-all duration-300 transform group-hover:scale-110" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'ta' ? 'மெனு கார்டு' : 'Menu Card'}
              </h2>
              <p className="text-gray-600">
                {language === 'ta' ? 'எங்கள் தையல் சேவைகள் மற்றும் விலைகளைப் பார்வையிடவும்' : 'View our tailoring services and prices'}
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/user/profile"
            className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group hover:shadow-2xl hover:shadow-accent-500/20 block"
          >
            <div className="text-center">
              <FaUser className="w-16 h-16 mx-auto mb-6 text-accent-500 group-hover:text-accent-600 transition-all duration-300 transform group-hover:scale-110" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'ta' ? 'தையல்காரர் சுயவிவரம்' : 'Tailor Profile'}
              </h2>
              <p className="text-gray-600">
                {language === 'ta' ? 'தையல்காரர் பற்றி அறிந்து கொள்ளவும் மற்றும் தொடர்பு கொள்ளவும்' : 'Learn about the tailor and get in touch'}
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Quick Actions Section with animations */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {language === 'ta' ? 'விரைவு செயல்கள்' : 'Quick Actions'}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Quick Action Buttons */}
            {[
              { to: "/user/menu", icon: <FaClipboardList className="w-8 h-8 mb-3 text-primary-500" />, label: language === 'ta' ? 'மெனு பார்க்க' : 'View Menu' },
              { to: "/user/profile", icon: <FaPhone className="w-8 h-8 mb-3 text-accent-500" />, label: language === 'ta' ? 'தொடர்பு' : 'Contact' },
              { to: "/user/orders", icon: <FaBoxOpen className="w-8 h-8 mb-3 text-blue-500" />, label: language === 'ta' ? 'எனது ஆர்டர்கள்' : 'My Orders' },
            ].map(action => (
              <Link key={action.to} to={action.to} className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center transform hover:scale-105">
                {action.icon}
                <p className="font-semibold text-gray-700">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
