import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, createSession } from '@/lib/simple-auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    const result = await verifyOTP(phone, otp)
    
    if (result.success && result.user) {
      const sessionId = createSession(result.user)
      
      return NextResponse.json({
        ...result,
        sessionId,
        debug: {
          phone,
          otp,
          userId: result.user.id,
          timestamp: new Date().toISOString(),
          serverTime: new Date().toLocaleTimeString()
        }
      })
    }
    
    return NextResponse.json({
      ...result,
      debug: {
        phone,
        otp,
        timestamp: new Date().toISOString(),
        serverTime: new Date().toLocaleTimeString()
      }
    })
  } catch (error) {
    console.error('Verify OTP API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
