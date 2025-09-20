'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  BellOff, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  CreditCard,
  DollarSign,
  Calendar,
  MessageCircle
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    // Load saved notifications
    const savedNotifications = localStorage.getItem('balaji_notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })))
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    // Load notification settings
    const settings = localStorage.getItem('balaji_settings')
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        setNotificationsEnabled(parsed.notifications?.push || true)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    // Create some sample notifications
    createSampleNotifications()
  }, [])

  const createSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Payment Received',
        message: 'Your EMI payment of ₹8,500 has been processed successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        action: {
          label: 'View Details',
          onClick: () => alert('Payment details will be shown here')
        }
      },
      {
        id: '2',
        type: 'info',
        title: 'Loan Application Update',
        message: 'Your loan application #LN001 is under review. We\'ll notify you within 24 hours.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        action: {
          label: 'Track Application',
          onClick: () => alert('Application tracking will be shown here')
        }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Upcoming Payment Due',
        message: 'Your next EMI of ₹8,500 is due on January 25, 2025.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        action: {
          label: 'Pay Now',
          onClick: () => alert('Payment page will open here')
        }
      },
      {
        id: '4',
        type: 'info',
        title: 'Credit Score Update',
        message: 'Your credit score has been updated. Check your profile for details.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true
      }
    ]

    setNotifications(sampleNotifications)
    localStorage.setItem('balaji_notifications', JSON.stringify(sampleNotifications))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('balaji_notifications', JSON.stringify(updated))
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('balaji_notifications', JSON.stringify(updated))
      return updated
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('balaji_notifications', JSON.stringify(updated))
      return updated
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!notificationsEnabled) {
    return (
      <div className="relative">
        <button
          onClick={() => setNotificationsEnabled(true)}
          className="p-2 text-gray-400 hover:text-gray-600"
          title="Enable Notifications"
        >
          <BellOff className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Mark All Read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                          >
                            {notification.type}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp.toLocaleString()}
                      </p>
                      {notification.action && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            notification.action?.onClick()
                          }}
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs"
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {unreadCount} unread notifications
                </p>
                <Button
                  onClick={() => setNotificationsEnabled(false)}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <BellOff className="h-3 w-3 mr-1" />
                  Disable
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
