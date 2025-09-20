'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogoWithText } from '@/components/logo'
import { 
  Smartphone, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  CreditCard,
  TrendingUp,
  Users,
  Mail,
  User,
  FileText,
  Calendar,
  ArrowLeft,
  Lock,
  AlertCircle
} from 'lucide-react'

type RegistrationStep = 'phone' | 'otp' | 'personal' | 'documents' | 'complete'

interface RegistrationData {
  phone: string
  otp: string
  email: string
  name: string
  panCard: string
  birthDate: string
}

export default function BuddyRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [showOtp, setShowOtp] = useState(false)
  const [isFromLogin, setIsFromLogin] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    phone: '',
    otp: '',
    email: '',
    name: '',
    panCard: '',
    birthDate: ''
  })

  // Check if user is coming from login with existing data
  useEffect(() => {
    const userData = localStorage.getItem('balaji_user')
    const sessionId = localStorage.getItem('balaji_session')
    
    if (userData && sessionId) {
      try {
        const user = JSON.parse(userData)
        console.log('🔄 User coming from login, pre-filling data:', user)
        
        // Set flag to indicate user is coming from login
        setIsFromLogin(true)
        
        // Pre-fill phone number and skip to personal info step
        setRegistrationData(prev => ({
          ...prev,
          phone: user.phone || '',
          email: user.email || '',
          name: user.name || '',
          panCard: user.panCard || '',
          birthDate: user.birthDate || ''
        }))
        
        // Skip phone and OTP steps, go directly to personal info
        if (user.phone) {
          setCurrentStep('personal')
          console.log('✅ Skipping to personal info step')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleSendOtp = async () => {
    if (!registrationData.phone || registrationData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/working-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: registrationData.phone })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentStep('otp')
        setCountdown(60)
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        // Show OTP in console for testing
        console.log(`🔐 Your OTP: ${data.otp}`)
        
        // Show OTP on screen for demo
        alert(`Your OTP: ${data.otp}\n\nThis will be sent via SMS in production.`)
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!registrationData.otp || registrationData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/working-auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: registrationData.phone, 
          otp: registrationData.otp 
        })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentStep('personal')
        // Don't overwrite name, keep it empty for user to fill
        setRegistrationData(prev => ({
          ...prev
        }))
      } else {
        setError(data.message || 'Invalid OTP. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalInfo = () => {
    console.log('Personal info data:', registrationData)
    console.log('Name:', registrationData.name, 'Email:', registrationData.email)
    
    if (!registrationData.email || !registrationData.name) {
      setError('Please fill in all required fields')
      return
    }

    if (!registrationData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setCurrentStep('documents')
    setError('')
  }

  const handleDocuments = async () => {
    if (!registrationData.panCard || !registrationData.birthDate) {
      setError('Please fill in all required fields')
      return
    }

    if (registrationData.panCard.length !== 10) {
      setError('PAN Card number should be 10 characters')
      return
    }

    // Validate ALL required data is present
    const requiredFields = {
      phone: registrationData.phone,
      name: registrationData.name,
      email: registrationData.email,
      panCard: registrationData.panCard,
      birthDate: registrationData.birthDate
    }

    console.log('🔍 VALIDATING ALL REGISTRATION DATA:')
    console.log('📱 Phone Number:', requiredFields.phone)
    console.log('👤 Full Name:', requiredFields.name)
    console.log('📧 Email Address:', requiredFields.email)
    console.log('🆔 PAN Card:', requiredFields.panCard)
    console.log('📅 Birth Date:', requiredFields.birthDate)

    // Check if any required field is missing
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key)

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`)
      return
    }

    // Store all registration data
    const completeUserData = {
      ...registrationData,
      id: `user_${Date.now()}`,
      role: 'BORROWER',
      createdAt: new Date().toISOString()
    }

    console.log('✅ COMPLETE USER DATA BEING STORED:', completeUserData)
    
    // Clear OTP after successful registration
    try {
      await fetch('/api/working-auth/clear-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: registrationData.phone })
      })
    } catch (error) {
      console.log('Failed to clear OTP:', error)
    }
    
    localStorage.setItem('balaji_user', JSON.stringify(completeUserData))
    localStorage.setItem('balaji_session', `session_${Date.now()}`)
    
    setCurrentStep('complete')
    setError('')
  }

  const handleComplete = () => {
    router.push('/buddy-dashboard')
  }

  const handleResendOtp = () => {
    if (countdown === 0) {
      handleSendOtp()
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case 'otp':
        setCurrentStep('phone')
        break
      case 'personal':
        setCurrentStep('otp')
        break
      case 'documents':
        setCurrentStep('personal')
        break
      default:
        break
    }
    setError('')
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned
    }
    return cleaned.slice(0, 10)
  }

  const formatOtp = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 6) {
      return cleaned
    }
    return cleaned.slice(0, 6)
  }

  const formatPanCard = (value: string) => {
    return value.replace(/[^A-Z0-9]/g, '').toUpperCase()
  }

  const getStepNumber = (step: RegistrationStep) => {
    const steps = ['phone', 'otp', 'personal', 'documents', 'complete']
    return steps.indexOf(step) + 1
  }

  const getTotalSteps = () => 4

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['phone', 'otp', 'personal', 'documents'].map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            getStepNumber(currentStep) > index + 1 
              ? 'bg-green-500 text-white' 
              : getStepNumber(currentStep) === index + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {getStepNumber(currentStep) > index + 1 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              getStepNumber(currentStep) > index + 1 ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={registrationData.phone}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              phone: formatPhone(e.target.value)
            }))}
            className="pl-10 h-12 text-lg"
            maxLength={10}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleSendOtp}
        disabled={loading || registrationData.phone.length !== 10}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sending OTP...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>Send OTP</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        )}
      </Button>
    </div>
  )

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verify Your Mobile Number
        </h3>
        <p className="text-gray-600 text-sm">
          We've sent a 6-digit code to <br />
          <span className="font-medium text-gray-900">+91 {registrationData.phone}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OTP Code *
        </label>
        <div className="relative">
          <Input
            type={showOtp ? 'text' : 'password'}
            placeholder="Enter 6-digit OTP"
            value={registrationData.otp}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              otp: formatOtp(e.target.value)
            }))}
            className="text-center text-2xl font-mono tracking-widest h-12"
            maxLength={6}
          />
          <button
            type="button"
            onClick={() => setShowOtp(!showOtp)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showOtp ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleVerifyOtp}
        disabled={loading || registrationData.otp.length !== 6}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Verify & Continue</span>
          </div>
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-gray-400">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Change mobile number
        </button>
      </div>
    </div>
  )

  const renderPersonalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Personal Information
        </h3>
        <p className="text-gray-600 text-sm">
          Please provide your basic details to continue
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter your full name"
            value={registrationData.name}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="pl-10 h-12"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={registrationData.email}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handlePersonalInfo}
        disabled={!registrationData.name || !registrationData.email}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <div className="flex items-center justify-center space-x-2">
          <span>Continue</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </Button>

      <div className="text-center">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to OTP verification
        </button>
      </div>
    </div>
  )

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Document Details
        </h3>
        <p className="text-gray-600 text-sm">
          Please provide your document information
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PAN Card Number *
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter PAN card number (e.g., ABCDE1234F)"
            value={registrationData.panCard}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              panCard: formatPanCard(e.target.value)
            }))}
            className="pl-10 h-12 font-mono"
            maxLength={10}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            value={registrationData.birthDate}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              birthDate: e.target.value
            }))}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleDocuments}
        disabled={!registrationData.panCard || !registrationData.birthDate}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <div className="flex items-center justify-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Complete Registration</span>
        </div>
      </Button>

      <div className="text-center">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to personal information
        </button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Registration Complete!
        </h3>
        <p className="text-gray-600 mb-6">
          Welcome to Balaji Loan, <span className="font-semibold">{registrationData.name}</span>!
        </p>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
        <h4 className="font-semibold text-gray-900 mb-3 text-center">📋 Collected Information:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">📱 Phone Number:</span>
            <span className="font-medium">{registrationData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">👤 Full Name:</span>
            <span className="font-medium">{registrationData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">📧 Email:</span>
            <span className="font-medium">{registrationData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">🆔 PAN Card:</span>
            <span className="font-medium">{registrationData.panCard}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">📅 Birth Date:</span>
            <span className="font-medium">{registrationData.birthDate}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-900">Your Account is Ready</span>
        </div>
        <p className="text-sm text-blue-700">
          You can now apply for loans, track your applications, and manage your account.
        </p>
      </div>

      <Button
        onClick={handleComplete}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        <div className="flex items-center justify-center space-x-2">
          <span>Go to Dashboard</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </Button>
    </div>
  )

  const getStepTitle = () => {
    switch (currentStep) {
      case 'phone': return 'Enter Mobile Number'
      case 'otp': return 'Verify OTP'
      case 'personal': return 'Personal Information'
      case 'documents': return 'Document Details'
      case 'complete': return 'Registration Complete'
      default: return 'Registration'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'phone': return 'We need your mobile number to get started'
      case 'otp': return 'Verify your mobile number with OTP'
      case 'personal': return 'Tell us about yourself'
      case 'documents': return 'Provide your document details'
      case 'complete': return 'All set! Welcome to Balaji Loan'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <LogoWithText size={40} />
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              Secure Registration
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">
              {isFromLogin ? 'Complete Your Profile' : 'Complete Your Registration'}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Mobile Verification</h3>
                  <p className="text-blue-100 text-sm">Verify your mobile number with OTP</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Personal Details</h3>
                  <p className="text-blue-100 text-sm">Provide your name and email address</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Document Details</h3>
                  <p className="text-blue-100 text-sm">Share your PAN card and birth date</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <p className="text-sm text-blue-100">
                "The registration process was super quick and easy. Got approved in minutes!"
              </p>
              <p className="text-xs text-blue-200 mt-2">- Priya Sharma, Verified Customer</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {getStepTitle()}
              </h1>
              <p className="text-gray-600">
                {getStepDescription()}
              </p>
            </div>

            {/* Login Redirect Message */}
            {isFromLogin && currentStep !== 'complete' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-blue-800 font-medium">Phone verified successfully!</p>
                    <p className="text-blue-600 text-sm">Please complete your profile information to continue.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step Indicator */}
            {currentStep !== 'complete' && renderStepIndicator()}

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {currentStep === 'phone' && renderPhoneStep()}
                {currentStep === 'otp' && renderOtpStep()}
                {currentStep === 'personal' && renderPersonalStep()}
                {currentStep === 'documents' && renderDocumentsStep()}
                {currentStep === 'complete' && renderCompleteStep()}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Bank Grade Security</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>RBI Registered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
