import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../utils/translations'

const About = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-8 text-center">
        {t.about}
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {language === 'ta' 
            ? 'தையல் வணிகங்களுக்காக குறிப்பாக வடிவமைக்கப்பட்ட நவீன ஆர்டர் மேலாண்மை அமைப்பு. வாடிக்கையாளர் ஆர்டர்களை நிர்வகிக்கவும், அளவீடுகளைக் கண்காணிக்கவும், உங்கள் பணிப்பாய்வை எளிதாக்கவும்.'
            : 'A modern order management system designed specifically for tailoring businesses. Manage customer orders, track measurements, and streamline your workflow with ease.'}
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div>
            <h2 className="text-xl font-semibold text-primary-600 mb-3">
              {language === 'ta' ? 'முக்கிய அம்சங்கள்' : 'Key Features'}
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">✓</span>
                {language === 'ta' ? 'ஆர்டர் மேலாண்மை' : 'Order Management'}
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">✓</span>
                {language === 'ta' ? 'அளவீடு கண்காணிப்பு' : 'Measurement Tracking'}
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">✓</span>
                {language === 'ta' ? 'வாடிக்கையாளர் பதிவுகள்' : 'Customer Records'}
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">✓</span>
                {language === 'ta' ? 'காலக்கெடு கண்காணிப்பு' : 'Due Date Tracking'}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-600 mb-3">
              {language === 'ta' ? 'கட்டப்பட்டது' : 'Built With'}
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">•</span>
                React & Vite
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">•</span>
                Tailwind CSS
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">•</span>
                FastAPI Backend
              </li>
              <li className="flex items-center">
                <span className="text-accent-500 mr-2">•</span>
                {language === 'ta' ? 'நவீன UI/UX' : 'Modern UI/UX'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

