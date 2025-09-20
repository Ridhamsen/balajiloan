import SimpleDashboardLayout from '@/components/dashboard/simple-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Plus,
  Eye,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, getStatusColor } from '@/lib/utils'

// Mock data - in real app, this would come from API
const mockStats = {
  totalLoans: 2,
  activeLoans: 1,
  totalBorrowed: 25000,
  totalRepaid: 5000,
  pendingApplications: 1,
  overdueAmount: 0
}

const mockRecentLoans = [
  {
    id: '1',
    amount: 20000,
    status: 'ACTIVE',
    dueDate: '2024-02-15',
    emi: 7000,
    remainingAmount: 14000
  },
  {
    id: '2',
    amount: 5000,
    status: 'PENDING',
    dueDate: null,
    emi: 1500,
    remainingAmount: 5000
  }
]

const mockUpcomingPayments = [
  {
    id: '1',
    amount: 7000,
    dueDate: '2024-02-15',
    status: 'PENDING'
  }
]

export default function WorkingDashboardPage() {
  return (
    <SimpleDashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your loan activities and account status
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/dashboard/apply">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Loan
                </Button>
              </Link>
            </div>
          </div>

          {/* Success Message */}
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Authentication System Working!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    You have successfully logged in to the Balaji Loan application. All features are now available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalLoans}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.activeLoans} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockStats.totalBorrowed)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(mockStats.totalRepaid)} repaid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Under review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(mockStats.overdueAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  All payments on time
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Loans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Loans</CardTitle>
                <CardDescription>
                  Your latest loan applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            Loan #{loan.id}
                          </h3>
                          <Badge className={getStatusColor(loan.status)}>
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Amount: {formatCurrency(loan.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          EMI: {formatCurrency(loan.emi)}
                        </p>
                        {loan.dueDate && (
                          <p className="text-sm text-gray-500">
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link href={`/dashboard/loans/${loan.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/loans">
                    <Button variant="outline" className="w-full">
                      View All Loans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>
                  Your next payment due dates and amounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          Payment #{payment.id}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Amount: {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Pay Now
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/repayments">
                    <Button variant="outline" className="w-full">
                      View All Payments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you can perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/dashboard/apply">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      Apply for Loan
                    </Button>
                  </Link>
                  <Link href="/dashboard/loans">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <CreditCard className="h-6 w-6 mb-2" />
                      View My Loans
                    </Button>
                  </Link>
                  <Link href="/dashboard/repayments">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Make Payment
                    </Button>
                  </Link>
                  <Link href="/dashboard/support">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <AlertCircle className="h-6 w-6 mb-2" />
                      Get Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SimpleDashboardLayout>
  )
}
