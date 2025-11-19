import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaShieldAlt, FaSignOutAlt, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'

const UserProfile = () => {
  const { user, logout, authenticatedFetch } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    email_verified: false
  })

  // Edit form data
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        email_verified: user.email_verified || false
      })
      setEditData({
        name: user.name || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      name: profileData.name,
      phone: profileData.phone
    })
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      const response = await authenticatedFetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      })

      const data = await response.json()

      if (response.ok) {
        setProfileData({
          ...profileData,
          name: editData.name,
          phone: editData.phone
        })
        setSuccess(
          language === 'ta' 
            ? 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
            : 'Profile updated successfully!'
        )
        setIsEditing(false)
      } else {
        setError(data.message || (language === 'ta' ? 'புதுப்பிப்பு தோல்வியடைந்தது' : 'Update failed'))
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setError(language === 'ta' ? 'பிழை ஏற்பட்டது' : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  }

  // Translations
  const profileText = language === 'ta' ? 'எனது சுயவிவரம்' : 'My Profile'
  const editProfileText = language === 'ta' ? 'சுயவிவரத்தைத் திருத்து' : 'Edit Profile'
  const saveText = language === 'ta' ? 'சேமி' : 'Save'
  const cancelText = language === 'ta' ? 'ரத்து செய்' : 'Cancel'
  const logoutText = language === 'ta' ? 'வெளியேறு' : 'Logout'
  const nameText = language === 'ta' ? 'பெயர்' : 'Name'
  const emailText = language === 'ta' ? 'மின்னஞ்சல்' : 'Email'
  const phoneText = language === 'ta' ? 'தொலைபேசி' : 'Phone'
  const verifiedText = language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'
  const notVerifiedText = language === 'ta' ? 'சரிபார்க்கப்படவில்லை' : 'Not Verified'
  const accountInfoText = language === 'ta' ? 'கணக்கு தகவல்' : 'Account Information'

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profileText}</h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'உங்கள் கணக்கு விவரங்களைப் பார்க்கவும் மற்றும் நிர்வகிக்கவும்'
              : 'View and manage your account details'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
          >
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-12 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <FaUser className="text-5xl text-primary-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center">{profileData.name}</h2>
            <p className="text-center text-white/80 mt-2">{profileData.email}</p>
          </div>

          {/* Profile Body */}
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{accountInfoText}</h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaEdit /> {editProfileText}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saveText}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <FaTimes /> {cancelText}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  {nameText}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={loading}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  {emailText}
                </label>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{profileData.email}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profileData.email_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <FaShieldAlt className="inline mr-1" />
                    {profileData.email_verified ? verifiedText : notVerifiedText}
                  </span>
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  {phoneText}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={loading}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profileData.phone || (language === 'ta' ? 'கொடுக்கப்படவில்லை' : 'Not provided')}
                  </p>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <FaSignOutAlt /> {logoutText}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          variants={cardVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {language === 'ta' ? 'பாதுகாப்பு தகவல்' : 'Security Information'}
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • {language === 'ta' 
                ? 'உங்கள் கணக்கு AWS Cognito மூலம் பாதுகாக்கப்படுகிறது'
                : 'Your account is secured with AWS Cognito'}
            </p>
            <p>
              • {language === 'ta' 
                ? 'மின்னஞ்சல் முகவரியை மாற்ற முடியாது'
                : 'Email address cannot be changed'}
            </p>
            <p>
              • {language === 'ta' 
                ? 'கடவுச்சொல்லை மீட்டமைக்க "கடவுச்சொல்லை மறந்துவிட்டீர்களா?" பயன்படுத்தவும்'
                : 'Use "Forgot Password" to reset your password'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UserProfile
