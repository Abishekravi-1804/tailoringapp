import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { FaEnvelope, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { GiSewingNeedle } from 'react-icons/gi'
import { motion } from 'framer-motion'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { confirmEmail, resendCode } = useAuth()
  const { language } = useLanguage()

  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState(location.state?.message || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const result = await confirmEmail(email, code)

      if (result.success) {
        setSuccess(true)
        setMessage(result.message)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: language === 'ta' 
                ? 'மின்னஞ்சல் சரிபார்க்கப்பட்டது! இப்போது உள்நுழையவும்.' 
                : 'Email verified! You can now login.' 
            } 
          })
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError(
        language === 'ta' 
          ? 'சரிபார்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' 
          : 'Verification failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError(language === 'ta' ? 'மின்னஞ்சலை உள்ளிடவும்' : 'Please enter your email')
      return
    }

    setError('')
    setMessage('')
    setResending(true)

    try {
      const result = await resendCode(email)

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Resend code error:', err)
      setError(
        language === 'ta' 
          ? 'குறியீட்டை மீண்டும் அனுப்ப முடியவில்லை' 
          : 'Failed to resend code'
      )
    } finally {
      setResending(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const titleText = language === 'ta' ? 'மின்னஞ்சலை சரிபார்க்கவும்' : 'Verify Your Email'
  const subtitleText = language === 'ta' 
    ? 'உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிடவும்'
    : 'Enter the 6-digit code sent to your email'
  const emailPlaceholder = language === 'ta' ? 'மின்னஞ்சல்' : 'Email'
  const codePlaceholder = language === 'ta' ? 'சரிபார்ப்பு குறியீடு' : 'Verification Code'
  const verifyButtonText = language === 'ta' ? 'சரிபார்க்கவும்' : 'Verify'
  const verifyingText = language === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying...'
  const resendCodeText = language === 'ta' ? 'குறியீட்டை மீண்டும் அனுப்பவும்' : 'Resend Code'
  const resendingText = language === 'ta' ? 'அனுப்புகிறது...' : 'Resending...'
  const backToLoginText = language === 'ta' ? 'உள்நுழைவுக்கு திரும்பு' : 'Back to Login'
  const didntReceiveText = language === 'ta' ? 'குறியீட்டைப் பெறவில்லையா?' : "Didn't receive the code?"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 z-10"
      >
        <div className="text-center mb-8">
          <GiSewingNeedle className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {titleText}
          </h1>
          <p className="text-gray-600 text-sm">
            {subtitleText}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaCheckCircle className="mr-2 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
            <FaTimesCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Message */}
        {message && !success && !error && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700"
              placeholder={emailPlaceholder}
              disabled={loading || success}
            />
          </div>

          {/* Verification Code Input */}
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full py-4 px-4 text-center text-3xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 text-gray-700 font-mono font-bold"
              placeholder="000000"
              disabled={loading || success}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              {language === 'ta' ? '6 இலக்க குறியீட்டை உள்ளிடவும்' : 'Enter 6-digit code'}
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || success || code.length !== 6}
            className="w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            {loading ? verifyingText : verifyButtonText}
          </button>

          {/* Resend Code Section */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">{didntReceiveText}</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending || loading || success}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending && <FaSpinner className="animate-spin inline mr-1" />}
              {resending ? resendingText : resendCodeText}
            </button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link 
            to="/login" 
            className="text-sm text-gray-600 hover:text-primary-600 hover:underline font-medium"
          >
            {backToLoginText}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
