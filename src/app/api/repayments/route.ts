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

    const repayments = await prisma.repayment.findMany({
      where: { userId: session.user.id },
      include: {
        application: {
          include: {
            product: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    })

    // Transform data for frontend
    const transformedRepayments = repayments.map(repayment => ({
      id: repayment.id,
      applicationId: repayment.applicationId,
      dueDate: repayment.dueDate,
      amountDue: repayment.amountDue,
      amountPaid: repayment.amountPaid,
      status: repayment.status,
      lateFees: repayment.lateFees,
      paidAt: repayment.paidAt,
      loan: {
        id: repayment.application.id,
        amount: repayment.application.amount,
        product: {
          name: repayment.application.product.name
        }
      }
    }))

    return NextResponse.json({
      success: true,
      repayments: transformedRepayments
    })

  } catch (error) {
    console.error('Repayments fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
