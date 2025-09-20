import { NextRequest, NextResponse } from 'next/server'
import { generateAndSendOTP } from '@/lib/auth'

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
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('OTP API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
