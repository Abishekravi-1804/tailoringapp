import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../utils/translations'
import { FaUserShield, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  
  const { login } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setNeedsVerification(false)
    
    try {
      console.log('🔐 Admin login attempt...')
      console.log('   Email:', email)
      
      // KEY: Pass true to indicate this IS an admin login
      const result = await login(email, password, true)
      
      console.log('📥 Admin login result:', result)
      
      if (result.success) {
        console.log('✅ Admin login successful! Redirecting to admin dashboard...')
        // Admin login successful - navigate to admin dashboard
        navigate('/admin/orders')
      } else {
        console.log('❌ Admin login failed:', result.message)
        
        // Check if error is due to unverified email
        if (result.message?.toLowerCase().includes('verify') || 
            result.message?.toLowerCase().includes('confirm')) {
          setNeedsVerification(true)
          setError(
            language === 'ta' 
              ? 'உங்கள் மின்னஞ்சலை முதலில் சரிபார்க்கவும்'
              : 'Please verify your email first'
          )
        } else if (result.message?.toLowerCase().includes('admin access required') || 
                   result.message?.toLowerCase().includes('403') ||
                   result.message?.toLowerCase().includes('forbidden')) {
          // Not an admin account
          setError(
            language === 'ta' 
              ? 'இந்த கணக்கிற்கு நிர்வாக அனுமதி இல்லை'
              : 'This account does not have admin access'
          )
        } else {
          setError(result.message || (language === 'ta' ? 'தவறான நிர்வாகி சான்றுகள்' : 'Invalid admin credentials'))
        }
      }
    } catch (err) {
      console.error('💥 Admin login exception:', err)
      setError(language === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Login failed. Please try again.')
    } finally {
      console.log('🏁 Admin login process completed')
      setLoading(false)
    }
  }

  const handleGoToVerification = () => {
    console.log('📧 Redirecting to verification page (admin)...')
    // Navigate to verification page with email pre-filled
    navigate('/verify-email', { state: { email, isAdmin: true } })
  }

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const emailPlaceholder = language === 'ta' ? 'நிர்வாகி மின்னஞ்சல்' : 'Admin Email'
  const passwordPlaceholder = language === 'ta' ? 'கடவுச்சொல்' : 'Password'
  const loginText = language === 'ta' ? 'உள்நுழை' : 'Login'
  const loggingInText = language === 'ta' ? 'உள்நுழைகிறது...' : 'Logging in...'
  const secureSignInText = language === 'ta' ? 'பாதுகாப்பான உள்நுழைவு' : 'Secure Sign In'
  const loginPromptText = language === 'ta' ? 'நிர்வாக கணக்கிற்கு உள்நுழையவும்' : 'Login to your administrator account'
  const adminPanelText = language === 'ta' ? 'நிர்வாக குழு' : 'Admin Panel'
  const manageOrdersText = language === 'ta' ? 'ஆர்டர்கள் மற்றும் செயல்பாடுகளை நிர்வகிக்கவும்.' : 'Manage orders and operations.'
  const switchToCustomerText = language === 'ta' ? 'வாடிக்கையாளர் உள்நுழைவுக்கு மாறவும்' : 'Switch to Customer Login'
  const verifyEmailText = language === 'ta' ? 'மின்னஞ்சலை சரிபார்க்கவும்' : 'Verify Email'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      
      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-white/10"
      >
        {/* Left side - Admin branding */}
        <div className="relative hidden md:block">
           <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1500&auto=format&fit=crop')"}}></div>
           <div className="relative flex flex-col items-center justify-center h-full p-12 text-white">
                <motion.div variants={itemVariants}>
                  <FaUserShield className="w-24 h-24 mx-auto mb-6 text-blue-400" />
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 text-center">
                    {adminPanelText}
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-center text-blue-200">
                    {manageOrdersText}
                </motion.p>
           </div>
        </div>

        {/* Right side - Admin login form */}
        <div className="p-8 md:p-12">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{secureSignInText}</h1>
            <p className="text-gray-400">{loginPromptText}</p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div 
              variants={itemVariants} 
              className={`border px-4 py-3 rounded-lg mb-6 text-sm font-medium ${
                needsVerification 
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' 
                  : 'bg-red-500/20 border-red-500 text-red-300'
              }`}
            >
              {error}
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleGoToVerification}
                  className="block mt-2 text-yellow-200 hover:text-yellow-100 font-bold underline"
                >
                  {verifyEmailText} →
                </button>
              )}
            </motion.div>
          )}

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="relative">
              <FaUserShield className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={emailPlaceholder} 
              />
            </div>
            
            {/* Password input */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={passwordPlaceholder} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition duration-150 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Security notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300 text-center">
                <FaUserShield className="inline mr-1" />
                {language === 'ta' 
                  ? 'பாதுகாப்பான நிர்வாக அணுகல்' 
                  : 'Secure Admin Access Only'}
              </p>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? loggingInText : loginText}
            </button>
          </motion.form>

          {/* Footer link */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors">
              {switchToCustomerText}
            </Link>
          </motion.div>

          {/* Additional security info */}
          <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              {language === 'ta' 
                ? 'நிர்வாக சான்றுகள் தேவை. உங்கள் தகவல் பாதுகாப்பானது.' 
                : 'Admin credentials required. Your information is secure.'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
