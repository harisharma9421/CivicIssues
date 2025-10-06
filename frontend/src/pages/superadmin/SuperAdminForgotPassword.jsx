import { useState } from 'react'
import { superAdminApi } from '../../utils/superAdminApi'

export default function SuperAdminForgotPassword() {
  const [channel, setChannel] = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState('request')
  const [status, setStatus] = useState('')

  const requestOtp = async () => {
    setStatus('')
    try {
      const res = await superAdminApi.requestPasswordOtp({ channel, identifier })
      if (!res.success) throw new Error(res.msg || 'Failed')
      setStep('verify')
      setStatus('OTP sent')
    } catch (e) {
      setStatus(e.message || 'Failed to send OTP')
    }
  }

  const verifyAndReset = async () => {
    setStatus('')
    try {
      const res = await superAdminApi.verifyAndResetPassword({ channel, identifier, code, newPassword })
      if (!res.success) throw new Error(res.msg || 'Failed')
      setStatus('Password reset successfully')
    } catch (e) {
      setStatus(e.message || 'Verification failed')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Super Admin Forgot Password</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="radio" checked={channel==='email'} onChange={()=>setChannel('email')} /> Email
        </label>
        <label style={{ marginLeft: 12 }}>
          <input type="radio" checked={channel==='sms'} onChange={()=>setChannel('sms')} /> Phone
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder={channel==='email' ? 'Email' : 'Phone number with country code e.g. +91XXXX'}
          value={identifier}
          onChange={(e)=>setIdentifier(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      {step==='request' && (
        <button onClick={requestOtp}>Send OTP</button>
      )}
      {step==='verify' && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <input placeholder="Enter OTP" value={code} onChange={(e)=>setCode(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input placeholder="New password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <button onClick={verifyAndReset}>Verify & Reset</button>
        </div>
      )}
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  )
}



