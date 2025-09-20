'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Shield,
  CreditCard,
  DollarSign,
  Calendar,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'

export default function BuddyCreditScorePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [creditScore, setCreditScore] = useState(750)
  const [creditHistory, setCreditHistory] = useState([
    { month: 'Jan', score: 720 },
    { month: 'Feb', score: 735 },
    { month: 'Mar', score: 742 },
    { month: 'Apr', score: 748 },
    { month: 'May', score: 750 },
    { month: 'Jun', score: 750 }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('balaji_user')
    const sessionId = localStorage.getItem('balaji_session')
    
    if (!userData || !sessionId) {
      router.push('/buddy-login')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      setUser(user)
      
      // Load dark mode setting
      const savedSettings = localStorage.getItem('balaji_settings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          const isDarkMode = settings.darkMode || false
          setDarkMode(isDarkMode)
          
          if (isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/buddy-login')
    } finally {
      setLoading(false)
    }

    // Listen for dark mode changes
    const handleDarkModeChange = () => {
      const savedSettings = localStorage.getItem('balaji_settings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          const isDarkMode = settings.darkMode || false
          setDarkMode(isDarkMode)
          
          if (isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      }
    }

    window.addEventListener('darkModeChanged', handleDarkModeChange)
    return () => window.removeEventListener('darkModeChanged', handleDarkModeChange)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credit score...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { label: 'EXCELLENT', color: 'bg-green-600', textColor: 'text-green-600' }
    if (score >= 740) return { label: 'VERY GOOD', color: 'bg-green-500', textColor: 'text-green-500' }
    if (score >= 670) return { label: 'GOOD', color: 'bg-yellow-500', textColor: 'text-yellow-500' }
    if (score >= 580) return { label: 'FAIR', color: 'bg-orange-500', textColor: 'text-orange-500' }
    if (score >= 300) return { label: 'POOR', color: 'bg-red-500', textColor: 'text-red-500' }
    return { label: 'VERY POOR', color: 'bg-red-600', textColor: 'text-red-600' }
  }

  const getScoreAngle = (score: number) => {
    // Convert score to angle (0-180 degrees)
    const minScore = 300
    const maxScore = 850
    const normalizedScore = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)))
    return normalizedScore * 180
  }

  const category = getScoreCategory(creditScore)
  const angle = getScoreAngle(creditScore)

  const handleRefreshScore = () => {
    alert('Refreshing your credit score...\n\nThis will take a few moments to fetch the latest data from credit bureaus.')
  }

  const handleDownloadReport = () => {
    alert('Downloading your credit report...\n\nThis will include:\n• Detailed credit score breakdown\n• Credit history\n• Factors affecting your score\n• Recommendations for improvement')
  }

  const CreditScoreGauge = () => (
    <div className="relative w-80 h-80 mx-auto">
      {/* Gauge Background */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background Arc */}
        <path
          d="M 50 150 A 100 100 0 0 1 150 150"
          fill="none"
          stroke={darkMode ? '#374151' : '#e5e7eb'}
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Colored Segments */}
        <path
          d="M 50 150 A 100 100 0 0 1 70 130"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 70 130 A 100 100 0 0 1 90 120"
          fill="none"
          stroke="#f97316"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 90 120 A 100 100 0 0 1 110 115"
          fill="none"
          stroke="#eab308"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 110 115 A 100 100 0 0 1 130 120"
          fill="none"
          stroke="#22c55e"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 130 120 A 100 100 0 0 1 150 150"
          fill="none"
          stroke="#16a34a"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Score Arc */}
        <path
          d={`M 50 150 A 100 100 0 0 1 ${50 + 100 * Math.cos((angle * Math.PI) / 180)} ${150 - 100 * Math.sin((angle * Math.PI) / 180)}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Needle */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-20 bg-white transform -translate-x-1/2 -translate-y-full origin-bottom transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: '50% 100%'
        }}
      />
      
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
      
      {/* Score Badge */}
      <div className="absolute top-8 right-8">
        <div className={`px-4 py-2 rounded-full ${category.color} text-white font-bold text-lg shadow-lg`}>
          {creditScore}
        </div>
      </div>
      
      {/* Category Labels */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className={`text-sm font-bold ${category.textColor}`}>
          {category.label}
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          CREDIT SCORE
        </div>
      </div>
      
      {/* Range Labels */}
      <div className="absolute bottom-2 left-4 text-xs text-gray-500">300</div>
      <div className="absolute bottom-2 right-4 text-xs text-gray-500">850</div>
    </div>
  )

  const CreditFactors = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <h4 className="font-medium text-green-800">Payment History</h4>
            <p className="text-sm text-green-600">No late payments in the last 24 months</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <h4 className="font-medium text-green-800">Credit Utilization</h4>
            <p className="text-sm text-green-600">Using 15% of available credit</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h4 className="font-medium text-yellow-800">Credit History Length</h4>
            <p className="text-sm text-yellow-600">2 years of credit history</p>
          </div>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <h4 className="font-medium text-green-800">Recent Inquiries</h4>
            <p className="text-sm text-green-600">No recent credit inquiries</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Credit Score</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Track your credit health</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/buddy-dashboard')}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Credit Score Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Credit Score Gauge */}
          <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${darkMode ? 'text-white' : ''}`}>
                <span>Your Credit Score</span>
                <Button
                  onClick={handleRefreshScore}
                  variant="outline"
                  size="sm"
                  className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Updated {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <CreditScoreGauge />
                <div className="mt-6 text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your credit score is in the <span className={category.textColor}>{category.label}</span> range
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    This score is used by lenders to evaluate your creditworthiness
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Factors */}
          <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
                <Shield className="h-5 w-5 mr-2" />
                Credit Factors
              </CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Factors affecting your credit score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreditFactors />
            </CardContent>
          </Card>
        </div>

        {/* Credit Score History */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              <TrendingUp className="h-5 w-5 mr-2" />
              Credit Score History
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Your credit score trend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {creditHistory.map((item, index) => (
                <div key={item.month} className="text-center">
                  <div className={`w-full h-32 bg-gray-100 rounded-lg flex items-end justify-center mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div 
                      className="w-8 bg-blue-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(item.score / 850) * 100}%` }}
                    />
                  </div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.score}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.month}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
                <TrendingUp className="h-5 w-5 mr-2" />
                Improve Your Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pay bills on time</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set up automatic payments to avoid late fees</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Keep credit utilization low</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Use less than 30% of your available credit</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Maintain old accounts</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Keep older credit accounts open to improve history length</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
                <DollarSign className="h-5 w-5 mr-2" />
                Loan Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Loan</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Up to ₹5,00,000</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Home Loan</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Up to ₹50,00,000</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Credit Card</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Up to ₹2,00,000 limit</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button
            onClick={() => router.push('/buddy-apply')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Apply for Loan
          </Button>
          <Button
            onClick={() => router.push('/buddy-support')}
            variant="outline"
            className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
          >
            <Eye className="h-4 w-4 mr-2" />
            Get Help
          </Button>
        </div>
      </div>
    </div>
  )
}
