'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock data - in real app, this would come from API
const mockStats = {
  totalApplications: 156,
  pendingApplications: 23,
  approvedApplications: 98,
  rejectedApplications: 35,
  totalDisbursed: 2450000,
  totalRepaid: 1800000,
  overdueAmount: 125000,
  activeLoans: 67
}

const mockApplications = [
  {
    id: '1',
    user: { name: 'John Doe', phone: '9876543210' },
    amount: 20000,
    tenure: 30,
    status: 'UNDER_REVIEW',
    riskScore: 75,
    createdAt: '2024-01-15T10:30:00Z',
    product: { name: 'Personal Loan' }
  },
  {
    id: '2',
    user: { name: 'Jane Smith', phone: '9876543211' },
    amount: 15000,
    tenure: 45,
    status: 'APPROVED',
    riskScore: 85,
    createdAt: '2024-01-14T14:20:00Z',
    product: { name: 'Student Loan' }
  },
  {
    id: '3',
    user: { name: 'Mike Johnson', phone: '9876543212' },
    amount: 5000,
    tenure: 15,
    status: 'REJECTED',
    riskScore: 45,
    createdAt: '2024-01-13T09:15:00Z',
    product: { name: 'Quick Cash' }
  }
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState(mockApplications)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const handleApprove = async (applicationId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'APPROVED' }
            : app
        )
      )
      toast.success('Application approved successfully')
    } catch (error) {
      toast.error('Failed to approve application')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (applicationId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'REJECTED' }
            : app
        )
      )
      toast.success('Application rejected')
    } catch (error) {
      toast.error('Failed to reject application')
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.user.phone.includes(searchTerm) ||
                         app.id.includes(searchTerm)
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage loan applications and monitor system performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.pendingApplications} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{mockStats.approvedApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {((mockStats.approvedApplications / mockStats.totalApplications) * 100).toFixed(1)}% approval rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockStats.totalDisbursed)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(mockStats.totalRepaid)} repaid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(mockStats.overdueAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.activeLoans} active loans
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Loan Applications</CardTitle>
                  <CardDescription>
                    Review and manage loan applications
                  </CardDescription>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Application ID</th>
                      <th className="text-left py-3 px-4">Borrower</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Tenure</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Risk Score</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">#{application.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{application.user.name}</div>
                            <div className="text-sm text-gray-500">{application.user.phone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(application.amount)}</td>
                        <td className="py-3 px-4">{application.tenure} days</td>
                        <td className="py-3 px-4">{application.product.name}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            application.riskScore >= 70 ? 'bg-green-100 text-green-800' :
                            application.riskScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {application.riskScore}/100
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(application.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/applications/${application.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {application.status === 'UNDER_REVIEW' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(application.id)}
                                  disabled={loading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(application.id)}
                                  disabled={loading}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
