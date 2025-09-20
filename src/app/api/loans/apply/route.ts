import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateRiskScore } from '@/lib/utils'

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
      productId,
      amount,
      tenure,
      purpose,
      employmentType,
      monthlyIncome,
      riskScore
    } = await request.json()

    // Validate required fields
    if (!productId || !amount || !tenure || !purpose || !employmentType || !monthlyIncome) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate amount and tenure
    if (amount < 500 || amount > 50000) {
      return NextResponse.json(
        { success: false, message: 'Amount must be between ₹500 and ₹50,000' },
        { status: 400 }
      )
    }

    if (tenure < 7 || tenure > 90) {
      return NextResponse.json(
        { success: false, message: 'Tenure must be between 7 and 90 days' },
        { status: 400 }
      )
    }

    // Check if user has a profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Please complete your profile first' },
        { status: 400 }
      )
    }

    // Check if user has any pending applications
    const pendingApplication = await prisma.loanApplication.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW']
        }
      }
    })

    if (pendingApplication) {
      return NextResponse.json(
        { success: false, message: 'You already have a pending application' },
        { status: 400 }
      )
    }

    // Create loan application
    const application = await prisma.loanApplication.create({
      data: {
        userId: session.user.id,
        productId,
        amount,
        tenure,
        purpose,
        riskScore: riskScore || calculateRiskScore(monthlyIncome, amount, employmentType, profile.kycStatus),
        status: 'SUBMITTED'
      },
      include: {
        product: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Loan application submitted successfully',
      applicationId: application.id,
      application
    })

  } catch (error) {
    console.error('Loan application error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
