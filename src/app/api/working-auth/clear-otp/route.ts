import { NextRequest, NextResponse } from 'next/server'
import { clearOTP } from '@/lib/simple-auth'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    clearOTP(phone)
    
    return NextResponse.json({
      success: true,
      message: 'OTP cleared successfully'
    })
  } catch (error) {
    console.error('Clear OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to clear OTP' },
      { status: 500 }
    )
  }
}
