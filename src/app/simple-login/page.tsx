'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SimpleLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, action: 'send-otp' }),
      })

      const data = await response.json()
      
      if (data.success) {
        setStep('otp')
        toast.success('OTP sent successfully!')
        console.log('Debug info:', data.debug)
      } else {
        toast.error(data.message || 'Failed to send OTP')
        console.error('Error:', data.debug)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
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
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, action: 'verify-otp' }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Login successful!')
        console.log('User data:', data.user)
        
        // Store user data in localStorage for demo
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Invalid OTP')
        console.error('Error:', data.debug)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, action: 'send-otp' }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('OTP sent again!')
        console.log('Debug info:', data.debug)
      } else {
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Balaji Loan</h1>
          </div>
          <p className="text-gray-600">Simple Login System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
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
                      className="pl-10"
                      maxLength={10}
                    />
                  </div>
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
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
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

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">🧪 Debug Information:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Open browser console (F12) to see detailed logs</li>
            <li>• Check terminal for OTP generation</li>
            <li>• Phone: {phone || 'Not entered'}</li>
            <li>• Step: {step}</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
