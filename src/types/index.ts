import { User, Profile, LoanApplication, LoanProduct, Offer, Agreement, Disbursement, Repayment, Ticket } from '@prisma/client'

export type { User, Profile, LoanApplication, LoanProduct, Offer, Agreement, Disbursement, Repayment, Ticket }

export interface UserWithProfile extends User {
  profile?: Profile | null
}

export interface LoanApplicationWithDetails extends LoanApplication {
  user: UserWithProfile
  product: LoanProduct
  offer?: Offer | null
  agreement?: Agreement | null
  disbursement?: Disbursement | null
  repayments: Repayment[]
}

export interface EMIScheduleItem {
  installment: number
  dueDate: Date
  principal: number
  interest: number
  total: number
  remainingPrincipal: number
}

export interface LoanOffer {
  sanctionedAmount: number
  apr: number
  fees: number
  tenure: number
  emi: number
  emiSchedule: EMIScheduleItem[]
}

export interface DashboardStats {
  totalApplications: number
  approvedApplications: number
  disbursedAmount: number
  overdueAmount: number
  activeLoans: number
  totalRepayments: number
}

export interface RepaymentSummary {
  totalDue: number
  totalPaid: number
  overdueAmount: number
  nextDueDate?: Date
  nextDueAmount?: number
}

export interface AuthUser {
  id: string
  phone: string
  email?: string | null
  role: string
  name?: string | null
}

declare module 'next-auth' {
  interface Session {
    user: AuthUser
  }
  
  interface User extends AuthUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    phone: string
  }
}
