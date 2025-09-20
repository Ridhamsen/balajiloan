'use client'

import { useState } from 'react'
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
  Users
} from 'lucide-react'

export default function BuddyLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/working-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (data.success) {
        setStep('otp')
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
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/working-auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })

      const data = await response.json()

      if (data.success) {
        // Store user data temporarily
        localStorage.setItem('balaji_user', JSON.stringify(data.user))
        localStorage.setItem('balaji_session', data.sessionId)
        
        // Check if user has complete profile information
        const user = data.user
        const hasCompleteProfile = user.name && user.email && user.panCard && user.birthDate
        
        console.log('🔍 Checking user profile completeness:', {
          name: user.name,
          email: user.email,
          panCard: user.panCard,
          birthDate: user.birthDate,
          hasCompleteProfile
        })
        
        if (hasCompleteProfile) {
          // User has complete profile, go to dashboard
          console.log('✅ User has complete profile, redirecting to dashboard')
          router.push('/buddy-dashboard')
        } else {
          // User has incomplete profile, redirect to registration
          console.log('⚠️ User has incomplete profile, redirecting to registration')
          router.push('/buddy-register')
        }
      } else {
        setError(data.message || 'Invalid OTP. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    if (countdown === 0) {
      handleSendOtp()
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <LogoWithText size={40} />
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">
              Get Your Personal Loan in Minutes
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Approval</h3>
                  <p className="text-blue-100 text-sm">Get approved in minutes with our AI-powered system</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Competitive Rates</h3>
                  <p className="text-blue-100 text-sm">Starting from 1.5% per month with flexible terms</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Trusted by 1M+ Users</h3>
                  <p className="text-blue-100 text-sm">Join millions who trust us with their financial needs</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <p className="text-sm text-blue-100">
                "I got my loan approved in just 10 minutes. The process was so smooth!"
              </p>
              <p className="text-xs text-blue-200 mt-2">- Priya Sharma, Verified Customer</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                {step === 'phone' 
                  ? 'Enter your mobile number to get started'
                  : 'Enter the OTP sent to your mobile'
                }
              </p>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {step === 'phone' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value))}
                          className="pl-10 h-12 text-lg"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleSendOtp}
                      disabled={loading || phone.length !== 10}
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

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Enter OTP
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We've sent a 6-digit code to <br />
                        <span className="font-medium text-gray-900">+91 {phone}</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OTP Code
                      </label>
                      <div className="relative">
                        <Input
                          type={showOtp ? 'text' : 'password'}
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(formatOtp(e.target.value))}
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
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
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
                        onClick={() => setStep('phone')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Change mobile number
                      </button>
                    </div>
                  </div>
                )}
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
