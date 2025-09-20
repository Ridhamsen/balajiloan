'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  User, 
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function BuddyProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    panCard: '',
    birthDate: ''
  })

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
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        panCard: user.panCard || '',
        birthDate: user.birthDate || ''
      })
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
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSaveProfile = () => {
    // Validate required fields
    if (!editForm.name || !editForm.email) {
      alert('Please fill in all required fields')
      return
    }

    if (!editForm.email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    // Update user data
    const updatedUser = {
      ...user,
      ...editForm
    }

    localStorage.setItem('balaji_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setEditing(false)
    
    alert('Profile updated successfully!')
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      panCard: user.panCard || '',
      birthDate: user.birthDate || ''
    })
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <p className="text-xs text-gray-500">Manage your account</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {!editing ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                {editing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{user.name || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                {editing ? (
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{user.email || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{user.phone}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
              </div>
            </CardContent>
          </Card>

          {/* Document Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Document Information
              </CardTitle>
              <CardDescription>
                Your KYC and document details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card Number
                </label>
                {editing ? (
                  <Input
                    value={editForm.panCard}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      panCard: e.target.value.toUpperCase()
                    }))}
                    placeholder="Enter PAN card number"
                    maxLength={10}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium font-mono">{user.panCard || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {editing ? (
                  <Input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      birthDate: e.target.value
                    }))}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{user.birthDate || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium font-mono">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Verified</p>
                  <p className="text-sm text-gray-500">Phone number verified</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Profile Complete</p>
                  <p className="text-sm text-gray-500">All details provided</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Active User</p>
                  <p className="text-sm text-gray-500">Account in good standing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Update Email
              </Button>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <X className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

