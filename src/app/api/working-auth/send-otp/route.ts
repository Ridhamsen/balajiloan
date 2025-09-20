import { NextRequest, NextResponse } from 'next/server'
import { generateAndSendOTP } from '@/lib/simple-auth'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    const result = await generateAndSendOTP(phone)
    
    return NextResponse.json({
      ...result,
      debug: {
        phone,
        timestamp: new Date().toISOString(),
        serverTime: new Date().toLocaleTimeString()
      }
    })
  } catch (error) {
    console.error('Send OTP API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
