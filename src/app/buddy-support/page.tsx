'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  MessageCircle, 
  Phone,
  Mail,
  HelpCircle,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react'

export default function BuddySupportPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'tickets'>('contact')
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    priority: 'Medium'
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
          <p className="text-gray-600">Loading support...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const faqs = [
    {
      id: 1,
      question: "How do I apply for a loan?",
      answer: "You can apply for a loan by clicking on 'Apply Loan' in your dashboard. Fill in the required details and submit your application. You'll receive a decision within 24 hours."
    },
    {
      id: 2,
      question: "What documents do I need?",
      answer: "You need a valid PAN card, Aadhaar card, bank statements for the last 3 months, and salary slip or income proof."
    },
    {
      id: 3,
      question: "How long does approval take?",
      answer: "Most applications are approved within 24 hours. You'll receive an SMS and email notification once your loan is approved."
    },
    {
      id: 4,
      question: "What are the interest rates?",
      answer: "Our interest rates start from 18% per annum. The exact rate depends on your credit score and loan amount."
    },
    {
      id: 5,
      question: "How do I make payments?",
      answer: "You can make payments through UPI, net banking, debit card, or by visiting our partner banks. Auto-debit facility is also available."
    },
    {
      id: 6,
      question: "Can I prepay my loan?",
      answer: "Yes, you can prepay your loan at any time. There are no prepayment charges for loans taken after 6 months."
    }
  ]

  const tickets = [
    {
      id: 1,
      subject: "Loan application status",
      status: "Resolved",
      priority: "High",
      createdDate: "2024-12-15",
      lastUpdate: "2024-12-16"
    },
    {
      id: 2,
      subject: "Payment gateway issue",
      status: "In Progress",
      priority: "Medium",
      createdDate: "2024-12-20",
      lastUpdate: "2024-12-20"
    }
  ]

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.message) {
      alert('Please fill in all required fields')
      return
    }
    
    alert(`Support ticket submitted successfully!\n\nSubject: ${ticketForm.subject}\nPriority: ${ticketForm.priority}\n\nYou will receive a response within 24 hours.`)
    
    setTicketForm({
      subject: '',
      message: '',
      priority: 'Medium'
    })
  }

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Get in Touch
        </h3>
        <p className="text-gray-600 text-sm">
          Choose your preferred way to contact us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
            <p className="text-sm text-gray-600 mb-4">Speak directly with our support team</p>
            <p className="text-lg font-semibold text-blue-600">+91 8290744998</p>
            <p className="text-xs text-gray-500 mt-1">Mon-Sat: 9 AM - 9 PM</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
            <p className="text-sm text-gray-600 mb-4">Send us your queries via email</p>
            <p className="text-lg font-semibold text-blue-600">dhruvmaru99@gmail.com</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Submit Support Ticket
          </CardTitle>
          <CardDescription>
            Create a support ticket for detailed assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <Input
              placeholder="Brief description of your issue"
              value={ticketForm.subject}
              onChange={(e) => setTicketForm(prev => ({
                ...prev,
                subject: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={ticketForm.priority}
              onChange={(e) => setTicketForm(prev => ({
                ...prev,
                priority: e.target.value
              }))}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              placeholder="Describe your issue in detail..."
              value={ticketForm.message}
              onChange={(e) => setTicketForm(prev => ({
                ...prev,
                message: e.target.value
              }))}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <Button
            onClick={handleSubmitTicket}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderFaqTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600 text-sm">
          Find answers to common questions
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTicketsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your Support Tickets
        </h3>
        <p className="text-gray-600 text-sm">
          Track your support requests
        </p>
      </div>

      {tickets.map((ticket) => (
        <Card key={ticket.id} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
              <Badge 
                variant={ticket.status === 'Resolved' ? 'default' : 'secondary'}
                className={`${
                  ticket.status === 'Resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {ticket.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Priority</p>
                <p className="font-medium">{ticket.priority}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{ticket.createdDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Update</p>
                <p className="font-medium">{ticket.lastUpdate}</p>
              </div>
              <div>
                <p className="text-gray-500">Ticket ID</p>
                <p className="font-medium">#{ticket.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Support</h1>
                <p className="text-xs text-gray-500">Get help and support</p>
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
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'contact'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'faq'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'tickets'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Tickets
          </button>
        </div>

        {/* Tab Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            {activeTab === 'contact' && renderContactTab()}
            {activeTab === 'faq' && renderFaqTab()}
            {activeTab === 'tickets' && renderTicketsTab()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

