import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateEMISchedule } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const loan = await prisma.loanApplication.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        status: 'APPROVED'
      },
      include: {
        offer: true,
        product: true
      }
    })

    if (!loan) {
      return NextResponse.json(
        { success: false, message: 'Loan not found or not approved' },
        { status: 404 }
      )
    }

    if (!loan.offer) {
      return NextResponse.json(
        { success: false, message: 'No offer available for this loan' },
        { status: 400 }
      )
    }

    // Generate EMI schedule
    const emiSchedule = calculateEMISchedule(
      loan.offer.sanctionedAmount,
      loan.offer.apr,
      loan.tenure,
      new Date()
    )

    // Create agreement
    const agreement = await prisma.agreement.create({
      data: {
        applicationId: loan.id,
        status: 'PENDING',
        pdfUrl: null // Will be generated when signed
      }
    })

    // Update loan status
    await prisma.loanApplication.update({
      where: { id: loan.id },
      data: { status: 'APPROVED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Offer accepted successfully',
      agreement
    })

  } catch (error) {
    console.error('Accept offer error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
