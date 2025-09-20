'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NotificationSystem from '@/components/notification-system'
import Logo, { LogoWithText } from '@/components/logo'
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  Target,
  Award,
  Star,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  BarChart3
} from 'lucide-react'

export default function BuddyDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

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
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/buddy-login')
    } finally {
      setLoading(false)
    }

    // Load dark mode setting
    const savedSettings = localStorage.getItem('balaji_settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        const isDarkMode = settings.darkMode || false
        setDarkMode(isDarkMode)
        
        // Apply dark mode to document
        if (isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [router])

  // Listen for dark mode changes from settings page
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('balaji_settings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          const isDarkMode = settings.darkMode || false
          setDarkMode(isDarkMode)
          
          // Apply dark mode to document
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

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab changes)
    window.addEventListener('darkModeChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('darkModeChanged', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('balaji_user')
    localStorage.removeItem('balaji_session')
    router.push('/buddy-login')
  }

  // Navigation handlers
  const handleNavigate = (path: string) => {
    console.log('🧭 Navigating to:', path)
    console.log('📍 Current router:', router)
    try {
      router.push(path)
      console.log('✅ Navigation successful')
    } catch (error) {
      console.error('❌ Navigation error:', error)
    }
  }

  const handleApplyLoan = () => {
    router.push('/buddy-apply')
  }

  const handleCheckCreditScore = () => {
    router.push('/buddy-credit-score')
  }

  const handleViewEMI = () => {
    alert('EMI Schedule:\n\nLoan 1: ₹8,500/month (Due: 25th Jan)\nLoan 2: ₹4,200/month (Pending)\n\nThis feature will be available soon!')
  }

  const handleMakePayment = () => {
    alert('Payment Options:\n\n• UPI\n• Net Banking\n• Debit Card\n• Wallet\n\nThis feature will be available soon!')
  }

  const handleContactSupport = () => {
    alert('Contact Support:\n\n📞 Phone: +91 8290744998\n📧 Email: dhruvmaru99@gmail.com\n💬 Live Chat: Available 24/7\n\nWe are here to help you!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickStats = [
    {
      title: 'Available Credit',
      value: '₹2,50,000',
      change: '+15%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Loans',
      value: '2',
      change: '1 new',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Next EMI Due',
      value: '₹8,500',
      change: 'In 5 days',
      changeType: 'warning',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Credit Score',
      value: '785',
      change: '+25',
      changeType: 'positive',
      icon: Target,
      color: 'bg-purple-500'
    }
  ]

  const recentLoans = [
    {
      id: 1,
      amount: '₹1,50,000',
      status: 'Active',
      emi: '₹8,500',
      dueDate: '2025-01-25',
      progress: 65,
      type: 'Personal Loan'
    },
    {
      id: 2,
      amount: '₹75,000',
      status: 'Pending',
      emi: '₹4,200',
      dueDate: 'N/A',
      progress: 0,
      type: 'Quick Loan'
    }
  ]

  const navigation = [
    { name: 'Dashboard', href: '/buddy-dashboard', icon: TrendingUp, current: true },
    { name: 'My Loans', href: '/buddy-loans', icon: CreditCard },
    { name: 'Apply Loan', href: '/buddy-apply', icon: Plus },
    { name: 'Credit Score', href: '/buddy-credit-score', icon: BarChart3 },
    { name: 'Repayments', href: '/buddy-repayments', icon: Calendar },
    { name: 'Support', href: '/buddy-support', icon: MessageCircle },
    { name: 'Profile', href: '/buddy-profile', icon: User },
    { name: 'Settings', href: '/buddy-settings', icon: Settings },
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <LogoWithText size={40} className={darkMode ? 'text-white' : ''} />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      console.log('🔘 Button clicked:', item.name, 'href:', item.href)
                      handleNavigate(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-xl w-full text-left ${
                      item.current
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-4 h-6 w-6 ${item.current ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className={`flex flex-col h-0 flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <LogoWithText size={40} className={darkMode ? 'text-white' : ''} />
              </div>
              <nav className="mt-8 flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        console.log('📱 Mobile button clicked:', item.name, 'href:', item.href)
                        handleNavigate(item.href)
                      }}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl w-full text-left ${
                        item.current
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                          : darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-blue-600' : 'text-gray-400'}`} />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            </div>
            <div className={`flex-shrink-0 flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.name || 'User'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.phone}
                  </p>
                </div>
                <div className="mr-2">
                  <NotificationSystem />
                </div>
                <button
                  onClick={() => handleNavigate('/buddy-settings')}
                  className="p-2 text-gray-400 hover:text-gray-600 mr-2"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top bar */}
        <div className={`sticky top-0 z-10 flex-shrink-0 flex h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Good morning, {user.name || 'User'}! 👋
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${darkMode ? 'bg-gray-800' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                        <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                        <p className={`text-xs mt-1 ${
                          stat.changeType === 'positive' ? 'text-green-600' :
                          stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className={`lg:col-span-2 border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-white' : ''}`}>Recent Loans</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Track your loan applications and active loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLoans.map((loan) => (
                    <div key={loan.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loan.type}</h3>
                          <Badge variant={loan.status === 'Active' ? 'default' : 'secondary'}>
                            {loan.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{loan.amount}</p>
                          </div>
                          <div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>EMI</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{loan.emi}</p>
                          </div>
                          <div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due Date</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{loan.dueDate}</p>
                          </div>
                        </div>
                        {loan.progress > 0 && (
                          <div className="mt-3">
                            <div className={`flex justify-between text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>Progress</span>
                              <span>{loan.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${loan.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleApplyLoan}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for New Loan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-white' : ''}`}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleCheckCreditScore}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Check Credit Score
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleViewEMI}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  View EMI Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleMakePayment}
                >
                  <DollarSign className="h-4 w-4 mr-3" />
                  Make Payment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  <MessageCircle className="h-4 w-4 mr-3" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Approval</h3>
                  <p className="text-sm text-gray-600">"Got my loan approved in just 5 minutes!"</p>
                  <p className="text-xs text-gray-500 mt-2">- Rajesh Kumar</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Great Rates</h3>
                  <p className="text-sm text-gray-600">"Best interest rates I found anywhere!"</p>
                  <p className="text-xs text-gray-500 mt-2">- Priya Sharma</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Process</h3>
                  <p className="text-sm text-gray-600">"Super simple application process!"</p>
                  <p className="text-xs text-gray-500 mt-2">- Amit Patel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
