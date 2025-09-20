'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Settings, 
  Moon,
  Sun,
  Bell,
  BellOff,
  Shield,
  Lock,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  MessageSquare,
  CreditCard
} from 'lucide-react'

export default function BuddySettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false,
    reminders: true,
    updates: true
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    sessionTimeout: '30'
  })
  const [showPassword, setShowPassword] = useState(false)

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
      
      // Load saved settings
      const savedSettings = localStorage.getItem('balaji_settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setDarkMode(settings.darkMode || false)
        setNotifications(settings.notifications || notifications)
        setPrivacy(settings.privacy || privacy)
        setSecurity(settings.security || security)
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/buddy-login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    saveSettings({ darkMode: newDarkMode })
    
    // Dispatch custom event to notify other pages
    window.dispatchEvent(new CustomEvent('darkModeChanged'))
  }

  const handleNotificationToggle = (key: string) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    }
    setNotifications(newNotifications)
    saveSettings({ notifications: newNotifications })
  }

  const handlePrivacyToggle = (key: string) => {
    const newPrivacy = {
      ...privacy,
      [key]: !privacy[key as keyof typeof privacy]
    }
    setPrivacy(newPrivacy)
    saveSettings({ privacy: newPrivacy })
  }

  const handleSecurityToggle = (key: string) => {
    const newSecurity = {
      ...security,
      [key]: !security[key as keyof typeof security]
    }
    setSecurity(newSecurity)
    saveSettings({ security: newSecurity })
  }

  const saveSettings = (newSettings: any) => {
    const currentSettings = JSON.parse(localStorage.getItem('balaji_settings') || '{}')
    const updatedSettings = { ...currentSettings, ...newSettings }
    localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings))
  }

  const handleChangePassword = () => {
    alert('Change Password feature will be available soon!\n\nThis will allow you to:\n• Set a new password\n• Enable two-factor authentication\n• Manage security settings')
  }

  const handleExportData = () => {
    alert('Export Data feature will be available soon!\n\nThis will allow you to:\n• Download your loan data\n• Export payment history\n• Get account statements')
  }

  const handleDeleteAccount = () => {
    const confirmed = confirm('Are you sure you want to delete your account?\n\nThis action cannot be undone and will:\n• Delete all your loan data\n• Remove your profile\n• Cancel any pending applications\n\nType "DELETE" to confirm:')
    
    if (confirmed) {
      const confirmText = prompt('Type "DELETE" to confirm account deletion:')
      if (confirmText === 'DELETE') {
        alert('Account deletion initiated. You will receive a confirmation email within 24 hours.')
      }
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your account preferences</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Theme Settings */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
              Theme Settings
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Customize your app appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dark Mode
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Switch between light and dark themes
                </p>
              </div>
              <Button
                onClick={handleDarkModeToggle}
                variant="outline"
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {key === 'email' && 'Receive notifications via email'}
                    {key === 'sms' && 'Receive SMS notifications'}
                    {key === 'push' && 'Receive push notifications'}
                    {key === 'marketing' && 'Receive marketing communications'}
                    {key === 'reminders' && 'Receive payment reminders'}
                    {key === 'updates' && 'Receive app updates'}
                  </p>
                </div>
                <Button
                  onClick={() => handleNotificationToggle(key)}
                  variant="outline"
                  size="sm"
                  className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  {value ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              <Shield className="h-5 w-5 mr-2" />
              Privacy Settings
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Control your data privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Profile Visibility
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Control who can see your profile
                </p>
              </div>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className={`px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Sharing
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Allow data sharing with partners
                </p>
              </div>
              <Button
                onClick={() => handlePrivacyToggle('dataSharing')}
                variant="outline"
                size="sm"
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                {privacy.dataSharing ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Analytics
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Help improve our app with usage analytics
                </p>
              </div>
              <Button
                onClick={() => handlePrivacyToggle('analytics')}
                variant="outline"
                size="sm"
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                {privacy.analytics ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              <Lock className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Two-Factor Authentication
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add an extra layer of security
                </p>
              </div>
              <Button
                onClick={() => handleSecurityToggle('twoFactor')}
                variant="outline"
                size="sm"
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                {security.twoFactor ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Biometric Login
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Use fingerprint or face ID
                </p>
              </div>
              <Button
                onClick={() => handleSecurityToggle('biometric')}
                variant="outline"
                size="sm"
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                {security.biometric ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Session Timeout
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Auto-logout after inactivity
                </p>
              </div>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className={`px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className={`border-0 shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? 'text-white' : ''}`}>
              <CreditCard className="h-5 w-5 mr-2" />
              Account Actions
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Manage your account data and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleChangePassword}
              variant="outline"
              className={`w-full ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>

            <Button
              onClick={handleExportData}
              variant="outline"
              className={`w-full ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Export My Data
            </Button>

            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              className={`w-full text-red-600 hover:text-red-700 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-red-300 hover:bg-red-50'}`}
            >
              <X className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardContent className="p-6 text-center">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Need Help?
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Contact our support team for assistance with your settings
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/buddy-support')}
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('tel:+918290744998')}
                className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
            </div>
            <div className={`mt-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              📞 +91 8290744998 | 📧 dhruvmaru99@gmail.com
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
