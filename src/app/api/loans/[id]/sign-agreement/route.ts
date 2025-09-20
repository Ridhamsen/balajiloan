import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
        agreement: true,
        offer: true
      }
    })

    if (!loan) {
      return NextResponse.json(
        { success: false, message: 'Loan not found or not approved' },
        { status: 404 }
      )
    }

    if (!loan.agreement) {
      return NextResponse.json(
        { success: false, message: 'No agreement found for this loan' },
        { status: 400 }
      )
    }

    if (loan.agreement.status === 'SIGNED') {
      return NextResponse.json(
        { success: false, message: 'Agreement already signed' },
        { status: 400 }
      )
    }

    // Mock PDF generation (in production, use a PDF library)
    const pdfUrl = `/agreements/${loan.id}.pdf`

    // Update agreement
    await prisma.agreement.update({
      where: { id: loan.agreement.id },
      data: {
        status: 'SIGNED',
        pdfUrl,
        signedAt: new Date()
      }
    })

    // Create disbursement record
    await prisma.disbursement.create({
      data: {
        applicationId: loan.id,
        amount: loan.offer?.sanctionedAmount || loan.amount,
        status: 'PENDING'
      }
    })

    // Generate repayment schedule
    if (loan.offer) {
      const emiSchedule = JSON.parse(loan.offer.emiScheduleJson)
      
      for (const emi of emiSchedule) {
        await prisma.repayment.create({
          data: {
            applicationId: loan.id,
            userId: session.user.id,
            dueDate: new Date(emi.dueDate),
            amountDue: emi.total,
            status: 'PENDING'
          }
        })
      }
    }

    // Update loan status
    await prisma.loanApplication.update({
      where: { id: loan.id },
      data: { status: 'DISBURSED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Agreement signed successfully',
      pdfUrl
    })

  } catch (error) {
    console.error('Sign agreement error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
