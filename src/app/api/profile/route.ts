import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({
        success: true,
        profile: null,
        message: 'Profile not found'
      })
    }

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      name,
      dateOfBirth,
      gender,
      address,
      employmentType,
      monthlyIncome,
      panNumber,
      aadhaarNumber,
      studentId,
      employeeId
    } = await request.json()

    // Validate required fields
    if (!name || !dateOfBirth || !gender || !address || !employmentType || !monthlyIncome) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Validate PAN format if provided
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid PAN number format' },
        { status: 400 }
      )
    }

    // Validate Aadhaar format if provided
    if (aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Aadhaar number format' },
        { status: 400 }
      )
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    const profileData = {
      name,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      employmentType,
      monthlyIncome: parseFloat(monthlyIncome),
      panNumber: panNumber || null,
      aadhaarNumber: aadhaarNumber || null,
      studentId: studentId || null,
      employeeId: employeeId || null,
    }

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: profileData
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          ...profileData
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
