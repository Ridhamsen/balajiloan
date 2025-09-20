// Simple authentication system that actually works
import { createHash } from 'crypto'

// In-memory storage for demo
const otpStore = new Map<string, { otp: string; expires: number }>()
const userStore = new Map<string, any>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function generateAndSendOTP(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
  try {
    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { success: false, message: 'Invalid phone number format' }
    }

    const otp = generateOTP()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(phone, { otp, expires })

    // Log OTP for testing
    console.log(`🔐 OTP for ${phone}: ${otp}`)
    console.log(`⏰ Expires at: ${new Date(expires).toLocaleTimeString()}`)

    return { 
      success: true, 
      message: 'OTP sent successfully',
      otp // Include OTP in response for testing
    }
  } catch (error) {
    console.error('OTP generation error:', error)
    return { success: false, message: 'Failed to send OTP' }
  }
}

export async function verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    console.log(`🔍 Verifying OTP for ${phone}: ${otp}`)
    
    const stored = otpStore.get(phone)
    console.log(`📱 Stored OTP data:`, stored)
    
    if (!stored) {
      console.log(`❌ No OTP found for ${phone}`)
      return { success: false, message: 'OTP not found. Please request a new OTP.' }
    }
    
    if (stored.expires < Date.now()) {
      console.log(`❌ OTP expired for ${phone}`)
      otpStore.delete(phone)
      return { success: false, message: 'OTP expired. Please request a new OTP.' }
    }
    
    if (stored.otp !== otp) {
      console.log(`❌ OTP mismatch: stored=${stored.otp}, provided=${otp}`)
      return { success: false, message: 'Invalid OTP. Please try again.' }
    }
    
    console.log(`✅ OTP verified successfully for ${phone}`)
    
    // Don't clear OTP immediately - let it expire naturally
    // This allows for multiple verification attempts during registration
    // otpStore.delete(phone)
    
    // Create or find user
    let user = userStore.get(phone)
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        phone,
        role: 'BORROWER',
        name: null,
        email: null,
        createdAt: new Date().toISOString()
      }
      userStore.set(phone, user)
      console.log(`👤 Created new user:`, user)
    } else {
      console.log(`👤 Found existing user:`, user)
    }
    
    return { 
      success: true, 
      message: 'OTP verified successfully',
      user
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { success: false, message: 'Failed to verify OTP' }
  }
}

export function createSession(user: any): string {
  const sessionId = createHash('md5').update(user.id + Date.now().toString()).digest('hex')
  // Store session (in production, use Redis or database)
  return sessionId
}

export function getUserByPhone(phone: string): any {
  return userStore.get(phone)
}

export function getAllUsers(): any[] {
  return Array.from(userStore.values())
}

export function clearOTP(phone: string): void {
  otpStore.delete(phone)
  console.log(`🗑️ Cleared OTP for ${phone}`)
}
