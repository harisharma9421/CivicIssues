import { useEffect, useMemo, useState } from 'react'
import { authApi } from '../../utils/api'
import { useAuthStore } from '../../utils/authStore'
import { Link, useSearchParams } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import TextField from '../../components/TextField.jsx'
import PasswordField from '../../components/PasswordField.jsx'
import Button from '../../components/Button.jsx'
import Logo from '../../components/Logo.jsx'
import { useTranslation } from 'react-i18next'

export default function AdminForgotPassword() {
  const { t } = useTranslation()
  const [channel, setChannel] = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState('request') // request | verify
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [searchParams] = useSearchParams()
  const user = useAuthStore(state => state.user)

  const derivedEmail = useMemo(() => {
    return (
      searchParams.get('email') ||
      (user && user.email) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('lastAdminEmail') : '') ||
      ''
    )
  }, [searchParams, user])

  // Phone flow removed

  useEffect(() => {
    setIdentifier(derivedEmail)
  }, [derivedEmail])

  useEffect(() => {
    if (!resendIn) return
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  // Phone normalization removed

  const requestOtp = async () => {
    setStatus('')
    setLoading(true)
    try {
      const payload = { channel: 'email', identifier: identifier?.trim().toLowerCase() }
      await authApi.requestPasswordOtp(payload)
      setStep('verify')
      setStatus('OTP sent')
      setResendIn(60)
    } catch (e) {
      setStatus(e?.response?.data?.msg || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndReset = async () => {
    setStatus('')
    setLoading(true)
    try {
      const payload = { channel: 'email', identifier: identifier?.trim().toLowerCase(), code: code?.trim(), newPassword }
      await authApi.verifyAndResetPassword(payload)
      setStatus('Password reset successfully')
    } catch (e) {
      setStatus(e?.response?.data?.msg || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Logo size="large" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.adminForgotPassword')}</h1>
            <p className="text-gray-600 mt-1">{t('auth.resetWithEmailOtp')}</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700">Email</span>
            </div>

            <TextField label={t('auth.email')} type="email" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="admin@example.com" autoComplete="email" />

            {step==='request' && (
              <div className="flex items-center gap-3">
                <Button onClick={requestOtp} loading={loading} disabled={loading || !identifier} className="flex-1">
                  {loading ? '...' : t('auth.sendOtp')}
                </Button>
              </div>
            )}

            {step==='verify' && (
              <div className="space-y-4">
                <TextField 
                  label={t('auth.enterOtp')}
                  value={code}
                  onChange={(e)=>setCode(e.target.value)}
                  placeholder="6-digit code"
                  inputMode="numeric"
                />
                <PasswordField 
                  label={t('auth.newPassword')}
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                  placeholder="Enter a strong password"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={verifyAndReset} loading={loading} disabled={loading || !code || !newPassword} className="flex-1">
                    {loading ? '...' : t('auth.verifyReset')}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={requestOtp}
                    disabled={resendIn > 0 || loading}
                    title={resendIn > 0 ? `Resend available in ${resendIn}s` : 'Resend OTP'}
                  >
                    {resendIn > 0 ? `Resend (${resendIn}s)` : 'Resend OTP'}
                  </Button>
                </div>
              </div>
            )}

            {!!status && (
              <div className={`rounded-lg p-3 ${status.toLowerCase().includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                {status}
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link to="/admin/login" className="font-medium text-blue-700 hover:text-blue-800">Back to login</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}



