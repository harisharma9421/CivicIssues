const crypto = require('crypto')
const EmailService = require('./emailService')

// In-memory store as a fallback; for production use Redis or Mongo with TTL index
const otpStore = new Map()

function generateOtpCode() {
    return ('' + Math.floor(100000 + Math.random() * 900000))
}

function storeOtp(key, code, ttlMs) {
    const expiresAt = Date.now() + ttlMs
    otpStore.set(key, { code, expiresAt, attempts: 0 })
}

function readOtp(key) {
    const entry = otpStore.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
        otpStore.delete(key)
        return null
    }
    return entry
}

function consumeOtp(key) {
    otpStore.delete(key)
}

class OtpService {
    constructor() {
        this.ttlMs = Number(process.env.OTP_TTL_MS || 5 * 60 * 1000)
        this.maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5)
    }

    buildKey(channel, identifier, role) {
        return `${channel}:${role}:${identifier}`
    }

    async sendOtpEmail(email, role) {
        const code = generateOtpCode()
        const key = this.buildKey('email', email.toLowerCase(), role)
        storeOtp(key, code, this.ttlMs)
        const subject = 'Your CivicConnect verification code'
        const text = `Your verification code is ${code}. It expires in ${Math.round(this.ttlMs / 60000)} minutes.`
        await EmailService.sendEmail(email, subject, text)
        return { success: true }
    }

    // SMS sending removed per requirements

    async verifyOtp(channel, identifier, role, code) {
        // Default local verification (email only)
        const key = this.buildKey(channel, identifier, role)
        const entry = readOtp(key)
        if (!entry) return { success: false, msg: 'Code expired or not found' }
        if (entry.attempts >= this.maxAttempts) {
            consumeOtp(key)
            return { success: false, msg: 'Too many attempts' }
        }
        entry.attempts += 1
        if (entry.code !== code) return { success: false, msg: 'Invalid code' }
        consumeOtp(key)
        return { success: true }
    }
}

module.exports = new OtpService()



