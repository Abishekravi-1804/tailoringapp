import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../utils/translations'
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa'
import { GiSewingNeedle } from 'react-icons/gi'
import { motion } from 'framer-motion'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' })
  
  const { signup } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]?.signup || translations.en.signup
  const navigate = useNavigate()

  const validatePasswordStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength({ score: 0, message: '' })
      return
    }

    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    }

    const passedChecks = Object.values(checks).filter(Boolean).length

    let strength = { score: 0, message: '', color: '' }

    if (passedChecks <= 2) {
      strength = { 
        score: 1, 
        message: language === 'ta' ? 'பலவீனமான கடவுச்சொல்' : 'Weak',
        color: 'text-red-600'
      }
    } else if (passedChecks === 3 || passedChecks === 4) {
      strength = { 
        score: 2, 
        message: language === 'ta' ? 'நடுத்தர கடவுச்சொல்' : 'Medium',
        color: 'text-yellow-600'
      }
    } else if (passedChecks === 5) {
      strength = { 
        score: 3, 
        message: language === 'ta' ? 'வலுவான கடவுச்சொல்' : 'Strong',
        color: 'text-green-600'
      }
    }

    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePasswordStrength(newPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation: Password length
    if (password.length < 8) {
      setError(
        language === 'ta' 
          ? 'கடவுச்சொல் குறைந்தபட்சம் 8 எழுத்துக்களைக் கொண்டிருக்க வேண்டும்' 
          : 'Password must be at least 8 characters long'
      )
      return
    }

    // Validation: Password requirements
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError(
        language === 'ta'
          ? 'கடவுச்சொல் பெரிய எழுத்து, சிறிய எழுத்து, எண் மற்றும் சிறப்பு எழுத்துக்களைக் கொண்டிருக்க வேண்டும்'
          : 'Password must contain uppercase, lowercase, number and special character'
      )
      return
    }

    // Validation: Passwords match
    if (password !== confirmPassword) {
      setError(
        language === 'ta' 
          ? 'கடவுச்சொற்கள் பொருந்தவில்லை' 
          : 'Passwords do not match'
      )
      return
    }

    setLoading(true)

    try {
      console.log('🚀 Starting signup process...')
      console.log('   Name:', name)
      console.log('   Email:', email)
      console.log('   Phone:', phone || 'None')
      
      const result = await signup(name, email, password, phone || null)
      
      console.log('📥 Signup result:', result)
      
      if (result.success) {
        console.log('✅ Signup successful! Redirecting to verification...')
        navigate('/verify-email', { 
          state: { 
            email,
            message: result.message 
          } 
        })
      } else {
        console.log('❌ Signup failed:', result.message)
        setError(result.message || (language === 'ta' ? 'பதிவு தோல்வியடைந்தது' : 'Signup failed'))
      }
    } catch (err) {
      console.error('💥 Signup exception:', err)
      setError(language === 'ta' ? 'ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'An error occurred. Please try again.')
    } finally {
      console.log('🏁 Signup process completed')
      setLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  const welcomeText = language === 'ta' ? 'புதிய கணக்கை உருவாக்கவும்' : 'Create an Account'
  const promptText = language === 'ta' ? 'தொடங்குவது விரைவானது மற்றும் எளிதானது' : "It's quick and easy to get started"
  const namePlaceholder = language === 'ta' ? 'முழு பெயர்' : 'Full Name'
  const emailPlaceholder = language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'
  const phonePlaceholder = language === 'ta' ? 'தொலைபேசி எண் (விருப்பம்)' : 'Phone Number (Optional)'
  const passwordPlaceholder = language === 'ta' ? 'கடவுச்சொல்' : 'Password'
  const confirmPasswordPlaceholder = language === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'
  const signupText = language === 'ta' ? 'பதிவு செய்' : 'Sign Up'
  const signingUpText = language === 'ta' ? 'பதிவு செய்கிறது...' : 'Signing Up...'
  const loginPrompt = language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'
  const loginLink = language === 'ta' ? 'இங்கே உள்நுழையவும்' : 'Login here'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10"
      >
        <div className="relative hidden md:block">
           <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1549060279-7f1699b54c41?q=80&w=1887&auto=format&fit=crop')"}}></div>
           <div className="absolute inset-0 bg-gradient-to-t from-primary-700/80 to-accent-600/70"></div>
           <div className="relative flex flex-col items-center justify-center h-full p-12 text-white">
               <motion.div variants={itemVariants}>
                 <GiSewingNeedle className="w-24 h-24 mb-6 drop-shadow-lg" />
               </motion.div>
               <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 text-center drop-shadow-md">
                 {language === 'ta' ? 'எங்களுடன் சேருங்கள்' : 'Join Our Community'}
               </motion.h1>
               <motion.p variants={itemVariants} className="text-lg text-center text-white/90 drop-shadow">
                 {language === 'ta' ? 'தனிப்பயன் ஃபேஷனுக்கான உங்கள் பயணத்தைத் தொடங்குங்கள்.' : 'Start your journey into custom fashion.'}
               </motion.p>
           </div>
        </div>

        <div className="p-8 md:p-12 relative">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{welcomeText}</h1>
            <p className="text-gray-600">{promptText}</p>
          </motion.div>

          {error && (
            <motion.div 
              variants={itemVariants} 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={namePlaceholder} 
              />
            </div>

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

            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={phonePlaceholder}
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={handlePasswordChange} 
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
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {password && passwordStrength.score > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score === 1 ? 'w-1/3 bg-red-500' :
                      passwordStrength.score === 2 ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span className={`font-medium ${passwordStrength.color}`}>
                  {passwordStrength.message}
                </span>
              </div>
            )}

            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">
                {language === 'ta' ? 'கடவுச்சொல் தேவைகள்:' : 'Password requirements:'}
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  {language === 'ta' ? 'குறைந்தபட்சம் 8 எழுத்துக்கள்' : 'At least 8 characters'}
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {language === 'ta' ? 'ஒரு பெரிய எழுத்து' : 'One uppercase letter'}
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  {language === 'ta' ? 'ஒரு சிறிய எழுத்து' : 'One lowercase letter'}
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                  {language === 'ta' ? 'ஒரு எண்' : 'One number'}
                </li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
                  {language === 'ta' ? 'ஒரு சிறப்பு எழுத்து (!@#$%^&*)' : 'One special character (!@#$%^&*)'}
                </li>
              </ul>
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={loading}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={confirmPasswordPlaceholder} 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition duration-150 disabled:opacity-50"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 mt-4 text-white font-bold rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? signingUpText : signupText}
            </button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {loginPrompt}
              <Link to="/login" className="text-primary-600 hover:underline font-bold ml-1">
                {loginLink}
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
