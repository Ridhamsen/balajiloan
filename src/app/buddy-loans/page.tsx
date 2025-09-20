'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  CreditCard, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react'

export default function BuddyLoansPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your loans...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const loans = [
    {
      id: 1,
      amount: 150000,
      status: 'Active',
      emi: 8500,
      dueDate: '2025-01-25',
      progress: 65,
      type: 'Personal Loan',
      appliedDate: '2024-06-15',
      interestRate: 18,
      remainingAmount: 97500
    },
    {
      id: 2,
      amount: 75000,
      status: 'Pending',
      emi: 4200,
      dueDate: null,
      progress: 0,
      type: 'Quick Loan',
      appliedDate: '2024-12-10',
      interestRate: 18,
      remainingAmount: 75000
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500'
      case 'Pending': return 'bg-yellow-500'
      case 'Approved': return 'bg-blue-500'
      case 'Rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />
      case 'Pending': return <Clock className="h-4 w-4" />
      case 'Approved': return <TrendingUp className="h-4 w-4" />
      case 'Rejected': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Loans</h1>
                <p className="text-xs text-gray-500">Track your loan applications</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Loans</p>
                  <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Loans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loans.filter(loan => loan.status === 'Active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Loans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loans.filter(loan => loan.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loans List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Loans</h2>
            <Button 
              onClick={() => router.push('/buddy-apply')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Apply New Loan
            </Button>
          </div>

          {loans.map((loan) => (
            <Card key={loan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getStatusColor(loan.status)} rounded-xl flex items-center justify-center`}>
                      {getStatusIcon(loan.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{loan.type}</h3>
                      <p className="text-sm text-gray-500">Applied on {loan.appliedDate}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={loan.status === 'Active' ? 'default' : 'secondary'}
                    className={`${loan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {loan.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly EMI</p>
                    <p className="font-semibold">₹{loan.emi.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-semibold">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining Amount</p>
                    <p className="font-semibold">₹{loan.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>

                {loan.status === 'Active' && loan.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Repayment Progress</span>
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

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {loan.status === 'Active' && (
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Make Payment
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                {loan.status === 'Active' && loan.dueDate && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700">
                        Next EMI due on {loan.dueDate}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {loans.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loans Found</h3>
              <p className="text-gray-600 mb-6">You haven't applied for any loans yet.</p>
              <Button 
                onClick={() => router.push('/buddy-apply')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Apply for Your First Loan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
