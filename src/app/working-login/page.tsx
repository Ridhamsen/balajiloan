'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WorkingLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setDebugInfo(null)
    
    try {
      const response = await fetch('/api/working-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()
      setDebugInfo(data)
      
      if (data.success) {
        setStep('otp')
        toast.success('OTP sent successfully!')
        console.log('✅ OTP sent:', data)
      } else {
        toast.error(data.message || 'Failed to send OTP')
        console.error('❌ OTP send failed:', data)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error('Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setDebugInfo(null)
    
    try {
      const response = await fetch('/api/working-auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await response.json()
      setDebugInfo(data)
      
      if (data.success) {
        toast.success('Login successful!')
        console.log('✅ Login successful:', data)
        
        // Store user data
        localStorage.setItem('balaji_user', JSON.stringify(data.user))
        localStorage.setItem('balaji_session', data.sessionId)
        
        // Redirect to working dashboard
        router.push('/working-dashboard')
      } else {
        toast.error(data.message || 'Invalid OTP')
        console.error('❌ Login failed:', data)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error('Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/working-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()
      setDebugInfo(data)
      
      if (data.success) {
        toast.success('OTP sent again!')
        console.log('✅ OTP resent:', data)
      } else {
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">Balaji Loan</h1>
          </div>
          <p className="text-gray-600">Working Authentication System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              {step === 'phone' ? (
                <>
                  <Smartphone className="h-5 w-5 mr-2" />
                  Enter Phone Number
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify OTP
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'phone' 
                ? 'We\'ll send you a verification code' 
                : `Enter the 6-digit code sent to ${phone}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 text-lg"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter 10-digit mobile number</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500">Enter 6-digit verification code</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-gray-600 hover:text-gray-900 mr-4"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-primary hover:text-primary/80"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Debug Information */}
        {debugInfo && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">🔍 Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2">📋 Instructions:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>1. Enter your 10-digit phone number</li>
              <li>2. Click "Send OTP"</li>
              <li>3. Check terminal for the OTP code</li>
              <li>4. Enter the exact OTP in the form</li>
              <li>5. Click "Verify & Sign In"</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
