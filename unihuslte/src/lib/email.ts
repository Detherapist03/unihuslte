import emailjs from 'emailjs-com'

// Initialize EmailJS
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

export async function sendOTPEmail(email: string, otp: string, name: string): Promise<boolean> {
  try {
    const templateParams = {
      to_email: email,
      to_name: name,
      otp_code: otp,
      app_name: 'UniHuslte',
    }

    await emailjs.send(serviceId, templateId, templateParams, publicKey)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

// For development/testing - log OTP to console
export function logOTPForDevelopment(email: string, otp: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔐 OTP for ${email}: ${otp}\n`)
  }
}