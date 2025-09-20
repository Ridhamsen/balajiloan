import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function calculateEMI(principal: number, annualRate: number, tenureDays: number): number {
  const monthlyRate = annualRate / 100 / 12
  const tenureMonths = tenureDays / 30
  
  if (monthlyRate === 0) {
    return principal / tenureMonths
  }
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  
  return Math.round(emi)
}

export function calculateEMISchedule(
  principal: number, 
  annualRate: number, 
  tenureDays: number,
  startDate: Date = new Date()
): Array<{
  installment: number
  dueDate: Date
  principal: number
  interest: number
  total: number
  remainingPrincipal: number
}> {
  const emi = calculateEMI(principal, annualRate, tenureDays)
  const monthlyRate = annualRate / 100 / 12
  const tenureMonths = Math.ceil(tenureDays / 30)
  const schedule: Array<{
    installment: number
    dueDate: Date
    principal: number
    interest: number
    total: number
    remainingPrincipal: number
  }> = []
  
  let remainingPrincipal = principal
  const currentDate = new Date(startDate)
  
  for (let i = 1; i <= tenureMonths; i++) {
    const interest = remainingPrincipal * monthlyRate
    const principalPayment = Math.min(emi - interest, remainingPrincipal)
    const total = principalPayment + interest
    
    remainingPrincipal -= principalPayment
    
    schedule.push({
      installment: i,
      dueDate: new Date(currentDate),
      principal: Math.round(principalPayment),
      interest: Math.round(interest),
      total: Math.round(total),
      remainingPrincipal: Math.round(remainingPrincipal),
    })
    
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  
  return schedule
}

export function calculateLateFees(amount: number, daysOverdue: number): number {
  // 2% per month or part thereof
  const monthsOverdue = Math.ceil(daysOverdue / 30)
  return Math.round(amount * 0.02 * monthsOverdue)
}

export function calculateRiskScore(
  monthlyIncome: number,
  requestedAmount: number,
  employmentType: string,
  kycStatus: string
): number {
  let score = 0
  
  // Income to loan ratio (lower is better)
  const incomeRatio = requestedAmount / monthlyIncome
  if (incomeRatio <= 0.5) score += 30
  else if (incomeRatio <= 1) score += 20
  else if (incomeRatio <= 2) score += 10
  else score += 0
  
  // Employment type
  switch (employmentType) {
    case 'EMPLOYEE':
      score += 25
      break
    case 'SELF_EMPLOYED':
      score += 15
      break
    case 'STUDENT':
      score += 10
      break
    case 'UNEMPLOYED':
      score += 0
      break
  }
  
  // KYC status
  if (kycStatus === 'VERIFIED') score += 25
  else if (kycStatus === 'PENDING') score += 10
  else score += 0
  
  // Amount-based scoring
  if (requestedAmount <= 5000) score += 20
  else if (requestedAmount <= 15000) score += 15
  else if (requestedAmount <= 30000) score += 10
  else score += 5
  
  return Math.min(score, 100)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateApplicationId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `BL${timestamp}${random}`.toUpperCase()
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

export function validateAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^\d{12}$/
  return aadhaarRegex.test(aadhaar)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'verified':
    case 'success':
    case 'paid':
    case 'signed':
      return 'text-green-600 bg-green-100'
    case 'pending':
    case 'draft':
    case 'processing':
      return 'text-yellow-600 bg-yellow-100'
    case 'rejected':
    case 'failed':
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    case 'overdue':
      return 'text-orange-600 bg-orange-100'
    case 'under_review':
    case 'in_progress':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate
}

export function getOverdueDays(dueDate: Date): number {
  if (!isOverdue(dueDate)) return 0
  return getDaysDifference(dueDate, new Date())
}
