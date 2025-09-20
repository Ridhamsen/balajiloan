import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo
const otpStore = new Map()
const userStore = new Map()

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, action } = await request.json()
    
    console.log(`🔐 Simple login API called: ${action} for ${phone}`)
    
    if (action === 'send-otp') {
      // Generate OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
      
      otpStore.set(phone, { otp: generatedOTP, expires })
      
      console.log(`🔐 OTP for ${phone}: ${generatedOTP}`)
      console.log(`⏰ Expires at: ${new Date(expires).toLocaleTimeString()}`)
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        debug: {
          phone,
          otp: generatedOTP,
          expires: new Date(expires).toLocaleString()
        }
      })
    }
    
    if (action === 'verify-otp') {
      const stored = otpStore.get(phone)
      
      console.log(`🔍 Verifying OTP for ${phone}: ${otp}`)
      console.log(`📱 Stored data:`, stored)
      
      if (!stored) {
        return NextResponse.json({
          success: false,
          message: 'OTP not found. Please request a new OTP.',
          debug: 'No OTP found for this phone number'
        })
      }
      
      if (stored.expires < Date.now()) {
        otpStore.delete(phone)
        return NextResponse.json({
          success: false,
          message: 'OTP expired. Please request a new OTP.',
          debug: 'OTP has expired'
        })
      }
      
      if (stored.otp !== otp) {
        return NextResponse.json({
          success: false,
          message: 'Invalid OTP. Please try again.',
          debug: `Expected: ${stored.otp}, Got: ${otp}`
        })
      }
      
      // OTP is valid - create or find user
      let user = userStore.get(phone)
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          phone,
          role: 'BORROWER',
          name: null,
          createdAt: new Date().toISOString()
        }
        userStore.set(phone, user)
        console.log(`👤 Created new user:`, user)
      } else {
        console.log(`👤 Found existing user:`, user)
      }
      
      // Clear OTP
      otpStore.delete(phone)
      
      return NextResponse.json({
        success: true,
        message: 'Login successful!',
        user,
        redirect: '/dashboard'
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    })
    
  } catch (error) {
    console.error('Simple login error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
