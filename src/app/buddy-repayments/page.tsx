'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Download
} from 'lucide-react'

export default function BuddyRepaymentsPage() {
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
          <p className="text-gray-600">Loading repayments...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const repayments = [
    {
      id: 1,
      loanId: 'LN001',
      amount: 8500,
      dueDate: '2025-01-25',
      status: 'Pending',
      paidDate: null,
      emiNumber: 7,
      totalEmis: 12,
      loanAmount: 150000,
      type: 'Personal Loan'
    },
    {
      id: 2,
      loanId: 'LN001',
      amount: 8500,
      dueDate: '2024-12-25',
      status: 'Paid',
      paidDate: '2024-12-24',
      emiNumber: 6,
      totalEmis: 12,
      loanAmount: 150000,
      type: 'Personal Loan'
    },
    {
      id: 3,
      loanId: 'LN001',
      amount: 8500,
      dueDate: '2024-11-25',
      status: 'Paid',
      paidDate: '2024-11-24',
      emiNumber: 5,
      totalEmis: 12,
      loanAmount: 150000,
      type: 'Personal Loan'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500'
      case 'Pending': return 'bg-yellow-500'
      case 'Overdue': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />
      case 'Pending': return <Clock className="h-4 w-4" />
      case 'Overdue': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleMakePayment = (repayment: any) => {
    alert(`Make Payment for EMI #${repayment.emiNumber}\n\nAmount: ₹${repayment.amount.toLocaleString()}\nDue Date: ${repayment.dueDate}\n\nThis feature will be available soon!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Repayments</h1>
                <p className="text-xs text-gray-500">Manage your loan payments</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total EMIs</p>
                  <p className="text-2xl font-bold text-gray-900">{repayments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid EMIs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {repayments.filter(r => r.status === 'Paid').length}
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
                  <p className="text-sm font-medium text-gray-600">Pending EMIs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {repayments.filter(r => r.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{repayments.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repayments List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Payment Schedule</h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Schedule
            </Button>
          </div>

          {repayments.map((repayment) => (
            <Card key={repayment.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getStatusColor(repayment.status)} rounded-xl flex items-center justify-center`}>
                      {getStatusIcon(repayment.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        EMI #{repayment.emiNumber} - {repayment.type}
                      </h3>
                      <p className="text-sm text-gray-500">Loan ID: {repayment.loanId}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={repayment.status === 'Paid' ? 'default' : 'secondary'}
                    className={`${repayment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {repayment.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">EMI Amount</p>
                    <p className="font-semibold">₹{repayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-semibold">{repayment.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EMI Number</p>
                    <p className="font-semibold">{repayment.emiNumber}/{repayment.totalEmis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paid Date</p>
                    <p className="font-semibold">{repayment.paidDate || 'Not paid'}</p>
                  </div>
                </div>

                {repayment.status === 'Paid' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-700">
                        Payment completed on {repayment.paidDate}
                      </span>
                    </div>
                  </div>
                )}

                {repayment.status === 'Pending' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-700">
                          Payment due on {repayment.dueDate}
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleMakePayment(repayment)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Progress: {Math.round((repayment.emiNumber / repayment.totalEmis) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {repayments.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Repayments Found</h3>
              <p className="text-gray-600 mb-6">You don't have any active loans with pending repayments.</p>
              <Button 
                onClick={() => router.push('/buddy-apply')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Apply for a Loan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
