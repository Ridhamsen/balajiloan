import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateLateFees, getOverdueDays } from '@/lib/utils'

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

    const repayment = await prisma.repayment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    if (!repayment) {
      return NextResponse.json(
        { success: false, message: 'Repayment not found or already paid' },
        { status: 404 }
      )
    }

    // Calculate late fees if overdue
    const dueDate = new Date(repayment.dueDate)
    const isOverdue = new Date() > dueDate
    let lateFees = repayment.lateFees

    if (isOverdue) {
      const overdueDays = getOverdueDays(dueDate)
      lateFees = calculateLateFees(repayment.amountDue, overdueDays)
    }

    const totalAmount = repayment.amountDue + lateFees

    // Mock payment processing (in production, integrate with payment gateway)
    const paymentRef = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Update repayment
    await prisma.repayment.update({
      where: { id: repayment.id },
      data: {
        amountPaid: totalAmount,
        status: 'PAID',
        paidAt: new Date(),
        lateFees
      }
    })

    // Check if all repayments for this loan are paid
    const remainingRepayments = await prisma.repayment.findMany({
      where: {
        applicationId: repayment.applicationId,
        status: 'PENDING'
      }
    })

    if (remainingRepayments.length === 0) {
      // Mark loan as completed
      await prisma.loanApplication.update({
        where: { id: repayment.applicationId },
        data: { status: 'COMPLETED' }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      paymentRef,
      amount: totalAmount
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
