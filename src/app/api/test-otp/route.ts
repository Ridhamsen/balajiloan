import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Generate a test OTP
    const testPhone = '9876543210'
    const testOTP = '123456'
    
    // Mock OTP store for testing
    const otpStore = new Map()
    otpStore.set(testPhone, { 
      otp: testOTP, 
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test OTP system',
      testPhone,
      testOTP,
      instructions: [
        '1. Go to http://localhost:3000/auth/signin',
        '2. Enter phone number: 9876543210',
        '3. Click Send OTP',
        '4. Enter OTP: 123456',
        '5. Click Verify & Sign In'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Test failed' },
      { status: 500 }
    )
  }
}
