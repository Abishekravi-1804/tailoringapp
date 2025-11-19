import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { translations } from '../../utils/translations'

// Import professional icons
import { GiSewingNeedle } from 'react-icons/gi'
import { FaGlobe, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaListAlt, FaBox, FaUser } from 'react-icons/fa'

const Layout = ({ children }) => {
  const { language, toggleLanguage } = useLanguage()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const t = translations[language]

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // State for user dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const currentYear = new Date().getFullYear();

  const navLinks = user ? (
    isAdmin() ? [
      { to: "/admin/orders", label: t.orders, icon: <FaBox /> }
    ] : [
      { to: "/user/dashboard", label: (language === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard'), icon: <FaTachometerAlt /> },
      { to: "/user/profile", label: (language === 'ta' ? 'சுயவிவரம்' : 'Profile'), icon: <FaUser /> },
      { to: "/user/menu", label: (language === 'ta' ? 'மெனு' : 'Menu'), icon: <FaListAlt /> }
    ]
  ) : [
    { to: "/login", label: (language === 'ta' ? 'உள்நுழை' : 'Login') },
    { to: "/admin/login", label: (language === 'ta' ? 'நிர்வாகி' : 'Admin') }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white text-gray-800 py-4 shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <GiSewingNeedle className="w-8 h-8 text-primary-500" />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {language === 'ta' ? 'தேவி தையலகம்' : 'Devi Thaiyalagam'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-8 list-none m-0 p-0">
              {navLinks.map(link => !user && (
                <li key={link.to}>
                  <Link to={link.to} className="font-semibold text-gray-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* User Menu & Language Toggle */}
            <div className='flex items-center gap-4'>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
                title="Change Language"
              >
                <FaGlobe />
                <span className='font-semibold'>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>
              
              {user && (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2"
                  >
                    <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-primary-500" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {/* Menu Links */}
                      {navLinks.map(link => (
                        <Link 
                          key={link.to} 
                          to={link.to} 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {link.icon} {link.label}
                        </Link>
                      ))}
                      
                      {/* Logout Button */}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt /> {language === 'ta' ? 'வெளியேறு' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-primary-500"
              title="Change Language"
            >
              <FaGlobe className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 px-6 pb-4 border-t border-gray-200">
            {/* User Info for Mobile */}
            {user && (
              <div className="py-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            
            <ul className="flex flex-col gap-2 mt-4">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center gap-3 font-semibold text-gray-600 hover:text-primary-500 transition-colors py-2"
                  >
                    {link.icon} {link.label}
                  </Link>
                </li>
              ))}
              
              {user && (
                <>
                  <hr className="my-2"/>
                  <li>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                      className="flex items-center gap-3 font-semibold text-red-600 hover:text-red-700 transition-colors py-2 w-full text-left"
                    >
                      <FaSignOutAlt /> {language === 'ta' ? 'வெளியேறு' : 'Logout'}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-5 mt-auto">
        <p>&copy; {currentYear} {language === 'ta' ? 'தேவி தையலகம்' : 'Devi Thaiyalagam'}. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
