import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { generateOTP } from './utils'

// Mock OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'phone',
      credentials: {
        phone: { label: 'Phone Number', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        console.log('🔐 NextAuth authorize called with:', credentials)
        
        if (!credentials?.phone) {
          console.log('❌ No phone provided')
          return null
        }

        // Check if this is OTP verification
        if (credentials.otp) {
          console.log(`🔍 Verifying OTP for ${credentials.phone}: ${credentials.otp}`)
          
          const stored = otpStore.get(credentials.phone)
          console.log('📱 Stored OTP data:', stored)
          
          if (!stored) {
            console.log('❌ No OTP found for this phone')
            return null
          }
          
          if (stored.expires < Date.now()) {
            console.log('❌ OTP expired')
            otpStore.delete(credentials.phone)
            return null
          }
          
          if (stored.otp !== credentials.otp) {
            console.log(`❌ OTP mismatch: stored=${stored.otp}, provided=${credentials.otp}`)
            return null
          }
          
          console.log('✅ OTP verified successfully')
          
          // Clear OTP after successful verification
          otpStore.delete(credentials.phone)
          
          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
            include: { profile: true },
          })
          
          if (!user) {
            console.log('👤 Creating new user for phone:', credentials.phone)
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                role: 'BORROWER',
              },
              include: { profile: true },
            })
          } else {
            console.log('👤 Found existing user:', user.id)
          }
          
          return {
            id: user.id,
            phone: user.phone,
            email: user.email,
            role: user.role,
            name: user.profile?.name || null,
          }
        }
        
        console.log('❌ No OTP provided')
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.phone = token.phone as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}

// OTP generation and verification functions
export async function generateAndSendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { success: false, message: 'Invalid phone number format' }
    }

    const otp = generateOTP()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes (increased for testing)

    // Store OTP
    otpStore.set(phone, { otp, expires })

    // In production, send OTP via SMS service
    console.log(`🔐 OTP for ${phone}: ${otp}`) // Mock SMS
    console.log(`⏰ Expires at: ${new Date(expires).toLocaleTimeString()}`)

    return { success: true, message: 'OTP sent successfully' }
  } catch (error) {
    console.error('OTP generation error:', error)
    return { success: false, message: 'Failed to send OTP' }
  }
}

export async function verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`🔍 Verifying OTP for ${phone}: ${otp}`)
    console.log(`📱 Stored OTPs:`, Array.from(otpStore.keys()))
    
    const stored = otpStore.get(phone)
    
    if (!stored) {
      console.log(`❌ No OTP found for ${phone}`)
      return { success: false, message: 'OTP not found or expired' }
    }
    
    console.log(`⏰ Current time: ${new Date().toLocaleTimeString()}`)
    console.log(`⏰ OTP expires: ${new Date(stored.expires).toLocaleTimeString()}`)
    console.log(`🔐 Stored OTP: ${stored.otp}`)
    console.log(`🔐 Entered OTP: ${otp}`)
    
    if (stored.expires < Date.now()) {
      otpStore.delete(phone)
      console.log(`❌ OTP expired for ${phone}`)
      return { success: false, message: 'OTP expired' }
    }
    
    if (stored.otp !== otp) {
      console.log(`❌ OTP mismatch for ${phone}`)
      return { success: false, message: 'Invalid OTP' }
    }
    
    console.log(`✅ OTP verified successfully for ${phone}`)
    return { success: true, message: 'OTP verified successfully' }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { success: false, message: 'Failed to verify OTP' }
  }
}
