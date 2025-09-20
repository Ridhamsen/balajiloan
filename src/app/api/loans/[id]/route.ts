import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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
        userId: session.user.id
      },
      include: {
        product: true,
        offer: true,
        agreement: true,
        disbursement: true,
        repayments: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    if (!loan) {
      return NextResponse.json(
        { success: false, message: 'Loan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      loan
    })

  } catch (error) {
    console.error('Loan fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
