import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../utils/translations'
import { FaEnvelope, FaLock, FaSpinner, FaWhatsapp, FaEye, FaEyeSlash } from 'react-icons/fa'
import { GiSewingNeedle } from 'react-icons/gi'
import { motion } from 'framer-motion'

const UserLogin = () => {
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
      console.log('🔐 User login attempt...')
      console.log('   Email:', email)
      
      // Call login with email, password, and is_admin flag (false for regular users)
      const result = await login(email, password, false)
      
      console.log('📥 Login result:', result)
      
      if (result.success) {
        console.log('✅ Login successful! Redirecting to dashboard...')
        // Login successful - navigate to user dashboard
        navigate('/user/dashboard')
      } else {
        console.log('❌ Login failed:', result.message)
        
        // Check if error is due to unverified email
        if (result.message?.toLowerCase().includes('verify') || 
            result.message?.toLowerCase().includes('confirm')) {
          setNeedsVerification(true)
          setError(
            language === 'ta' 
              ? 'உங்கள் மின்னஞ்சலை சரிபார்க்கவும். சரிபார்ப்பு பக்கத்திற்கு செல்ல இங்கே கிளிக் செய்யவும்.'
              : 'Please verify your email first. Click below to go to verification page.'
          )
        } else {
          setError(result.message || (language === 'ta' ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்' : 'Invalid email or password'))
        }
      }
    } catch (err) {
      console.error('💥 Login exception:', err)
      setError(language === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Login failed. Please try again.')
    } finally {
      console.log('🏁 Login process completed')
      setLoading(false)
    }
  }
  
  const handleWhatsAppHelp = () => {
    const message = language === 'ta' 
      ? 'வணக்கம், எனக்கு உள்நுழைவதில் சிக்கல் உள்ளது.'
      : 'Hello, I am having trouble logging in.'
    window.open(`https://wa.me/918122780990?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleGoToVerification = () => {
    console.log('📧 Redirecting to verification page...')
    // Navigate to verification page with email pre-filled
    navigate('/verify-email', { state: { email } })
  }

  const loginText = t?.login?.button_login || (language === 'ta' ? 'உள்நுழை' : 'Login')
  const loggingInText = t?.login?.button_logging_in || (language === 'ta' ? 'உள்நுழைகிறது...' : 'Logging in...')
  const emailPlaceholder = t?.login?.placeholder_email || (language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address')
  const passwordPlaceholder = t?.login?.placeholder_password || (language === 'ta' ? 'கடவுச்சொல்' : 'Password')
  const welcomeText = t?.login?.welcome || (language === 'ta' ? 'மீண்டும் வருக' : 'Welcome Back')
  const signInPrompt = t?.login?.sign_in_prompt || (language === 'ta' ? 'உங்கள் கணக்கில் உள்நுழையவும்' : 'Please sign in to your account')
  const noAccountText = t?.login?.no_account_prompt || (language === 'ta' ? 'கணக்கு இல்லையா?' : "Don't have an account?")
  const signUpLinkText = t?.login?.signup_link || (language === 'ta' ? 'இங்கே பதிவு செய்யவும்' : 'Sign up here')
  const needHelpText = t?.login?.need_help || (language === 'ta' ? 'உதவி தேவையா?' : 'Need Help?')
  const forgotPasswordText = t?.login?.forgot_password || (language === 'ta' ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot Password?')
  const verifyEmailText = language === 'ta' ? 'மின்னஞ்சலை சரிபார்க்கவும்' : 'Verify Email'

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10"
      >
        {/* Left side - Branding */}
        <div className="relative hidden md:block">
           <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1541893325-3b91a03e1c66?q=80&w=1500&auto=format&fit=crop')"}}></div>
           <div className="absolute inset-0 bg-gradient-to-t from-primary-700/80 to-accent-600/70"></div>
           <div className="relative flex flex-col items-center justify-center h-full p-12 text-white">
             <motion.div variants={itemVariants}>
               <GiSewingNeedle className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-lg" />
             </motion.div>
             <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 text-center drop-shadow-md">
               {language === 'ta' ? 'தேவி தையலகம்' : 'Devi Thaiyalagam'}
             </motion.h1>
             <motion.p variants={itemVariants} className="text-lg text-center text-white/90 drop-shadow">
               {language === 'ta' ? 'தனிப்பயன் தையலில் நேர்த்தியும் கைவினைத்திறனும்.' : 'Where elegance and craftsmanship are stitched together.'}
             </motion.p>
           </div>
        </div>

        {/* Right side - Login form */}
        <div className="p-8 md:p-12 flex flex-col">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{welcomeText}</h1>
            <p className="text-gray-600">{signInPrompt}</p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div 
              variants={itemVariants} 
              className={`border-l-4 px-4 py-3 rounded-lg mb-6 text-sm font-medium ${
                needsVerification 
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-700' 
                  : 'bg-red-100 border-red-500 text-red-700'
              }`}
            >
              {error}
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleGoToVerification}
                  className="block mt-2 text-yellow-800 hover:text-yellow-900 font-bold underline"
                >
                  {verifyEmailText} →
                </button>
              )}
            </motion.div>
          )}

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-grow">
            
            {/* Email input */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={emailPlaceholder} 
              />
            </div>
            
            {/* Password input */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={passwordPlaceholder} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition duration-150 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Forgot password link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-primary-600 hover:underline transition-colors">
                {forgotPasswordText}
              </Link>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 mt-4 text-white font-bold rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? loggingInText : loginText}
            </button>

            <div className="flex-grow"></div>

            {/* Footer links */}
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {noAccountText}
                <Link to="/signup" className="text-primary-600 hover:underline font-bold ml-1">
                  {signUpLinkText}
                </Link>
              </p>
              <button 
                type="button"
                onClick={handleWhatsAppHelp} 
                className="text-sm text-green-600 hover:underline font-semibold flex items-center justify-center gap-2 mx-auto"
              >
                <FaWhatsapp /> {needHelpText}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}

export default UserLogin
