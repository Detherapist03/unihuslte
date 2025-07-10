// Email utilities for UniHuslte using EmailJS
import emailjs from 'emailjs-com'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

export interface EmailParams {
  to_email: string
  to_name: string
  otp_code: string
  [key: string]: unknown
}

// Send OTP verification email
export async function sendOTPEmail(email: string, name: string, otpCode: string): Promise<boolean> {
  try {
    const templateParams: EmailParams = {
      to_email: email,
      to_name: name,
      otp_code: otpCode
    }

    // Initialize EmailJS with public key
    emailjs.init(PUBLIC_KEY)

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response.status, response.text)
    return response.status === 200
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// For development/testing - mock email sending
export function mockSendOTP(email: string, name: string, otpCode: string): boolean {
  console.log(`Mock email sent to ${email} (${name}) with OTP: ${otpCode}`)
  return true
}