'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield
} from 'lucide-react'

export default function BuddyApplyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount')
  const [formData, setFormData] = useState({
    amount: '',
    purpose: 'Personal',
    tenure: '12',
    monthlyIncome: '',
    employment: 'Salaried'
  })

  const handleAmountSubmit = () => {
    if (!formData.amount || parseInt(formData.amount) < 10000) {
      alert('Please enter a valid loan amount (minimum ₹10,000)')
      return
    }
    setStep('details')
  }

  const handleDetailsSubmit = () => {
    if (!formData.monthlyIncome) {
      alert('Please enter your monthly income')
      return
    }
    setStep('success')
  }

  const handleApplyNow = () => {
    setLoading(true)
    // Simulate application submission
    setTimeout(() => {
      setLoading(false)
      alert('🎉 Loan application submitted successfully!\n\nYou will receive an approval decision within 24 hours.')
      router.push('/buddy-dashboard')
    }, 2000)
  }

  const calculateEMI = () => {
    const amount = parseInt(formData.amount) || 0
    const tenure = parseInt(formData.tenure) || 12
    const rate = 18 // 18% annual rate
    const monthlyRate = rate / 12 / 100
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1)
    return Math.round(emi)
  }

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How much do you need?
        </h3>
        <p className="text-gray-600 text-sm">
          Enter your desired loan amount
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              amount: e.target.value
            }))}
            className="pl-8 h-12 text-lg"
            min="10000"
            max="500000"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum: ₹10,000 | Maximum: ₹5,00,000
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Purpose
        </label>
        <select
          value={formData.purpose}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            purpose: e.target.value
          }))}
          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Personal">Personal Loan</option>
          <option value="Medical">Medical Emergency</option>
          <option value="Education">Education</option>
          <option value="Wedding">Wedding</option>
          <option value="Home">Home Renovation</option>
          <option value="Business">Business</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Repayment Tenure
        </label>
        <select
          value={formData.tenure}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            tenure: e.target.value
          }))}
          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="18">18 months</option>
          <option value="24">24 months</option>
          <option value="36">36 months</option>
        </select>
      </div>

      {formData.amount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Loan Summary:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Loan Amount:</span>
              <span className="font-medium">₹{parseInt(formData.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tenure:</span>
              <span className="font-medium">{formData.tenure} months</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated EMI:</span>
              <span className="font-medium">₹{calculateEMI().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span className="font-medium">18% p.a.</span>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleAmountSubmit}
        disabled={!formData.amount || parseInt(formData.amount) < 10000}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        Continue to Details
      </Button>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Additional Details
        </h3>
        <p className="text-gray-600 text-sm">
          Help us process your application faster
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Income *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            placeholder="Enter monthly income"
            value={formData.monthlyIncome}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              monthlyIncome: e.target.value
            }))}
            className="pl-8 h-12"
            min="15000"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum: ₹15,000 per month
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employment Type
        </label>
        <select
          value={formData.employment}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            employment: e.target.value
          }))}
          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Business">Business Owner</option>
          <option value="Freelancer">Freelancer</option>
        </select>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Final Loan Summary:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Amount:</span>
            <span className="font-medium">₹{parseInt(formData.amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Purpose:</span>
            <span className="font-medium">{formData.purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tenure:</span>
            <span className="font-medium">{formData.tenure} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly EMI:</span>
            <span className="font-medium">₹{calculateEMI().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Income:</span>
            <span className="font-medium">₹{parseInt(formData.monthlyIncome).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep('amount')}
          className="flex-1 h-12"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleDetailsSubmit}
          disabled={!formData.monthlyIncome}
          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Application Ready!
        </h3>
        <p className="text-gray-600 mb-6">
          Review your loan application details below
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
        <h4 className="font-semibold text-blue-900 mb-4">📋 Loan Application Summary:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Loan Amount:</span>
            <span className="font-medium">₹{parseInt(formData.amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Purpose:</span>
            <span className="font-medium">{formData.purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Tenure:</span>
            <span className="font-medium">{formData.tenure} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Monthly EMI:</span>
            <span className="font-medium">₹{calculateEMI().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Monthly Income:</span>
            <span className="font-medium">₹{parseInt(formData.monthlyIncome).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Employment:</span>
            <span className="font-medium">{formData.employment}</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium text-green-900">Secure Application</span>
        </div>
        <p className="text-sm text-green-700">
          Your application is secure and will be processed within 24 hours.
        </p>
      </div>

      <Button
        onClick={handleApplyNow}
        disabled={loading}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Submitting Application...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Submit Loan Application</span>
          </div>
        )}
      </Button>

      <div className="text-center">
        <button
          onClick={() => setStep('details')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to details
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Balaji Loan</h1>
                <p className="text-xs text-gray-500">Apply for Personal Loan</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/buddy-dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">
              Get Your Loan in Minutes
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Approval</h3>
                  <p className="text-blue-100 text-sm">Get approved in minutes with our AI-powered system</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Process</h3>
                  <p className="text-blue-100 text-sm">Bank-level security with encrypted data transmission</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Flexible Repayment</h3>
                  <p className="text-blue-100 text-sm">Choose repayment tenure from 6 to 36 months</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <p className="text-sm text-blue-100">
                "Applied for ₹50,000 and got approved in just 15 minutes!"
              </p>
              <p className="text-xs text-blue-200 mt-2">- Rajesh Kumar, Verified Customer</p>
            </div>
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <p className="text-xs text-blue-100">📞 +91 8290744998</p>
              <p className="text-xs text-blue-100">📧 dhruvmaru99@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Right Side - Application Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {step === 'amount' && renderAmountStep()}
                {step === 'details' && renderDetailsStep()}
                {step === 'success' && renderSuccessStep()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
