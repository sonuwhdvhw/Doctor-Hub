import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Stethoscope, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ResetPassword = () => {
    const { resetPassword, loading } = useAuth()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const token = params.get('token') || ''
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirm) return
        const result = await resetPassword(token, password)
        if (result.success) navigate('/login')
    }

    if (!token) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center px-4'>
                <div className='card p-8 text-center max-w-md'>
                    <p className='text-slate-800 font-semibold'>Invalid reset link</p>
                    <Link to='/forgot-password' className='btn-primary mt-4 inline-flex'>Request new link</Link>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md animate-slide-up'>
                <div className='text-center mb-8'>
                    <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow mb-4'>
                        <Stethoscope size={24} className='text-white' />
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>Set new password</h1>
                </div>
                <form onSubmit={onSubmit} className='card p-8 space-y-5'>
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-1.5 block'>New Password</label>
                        <div className='relative'>
                            <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className='input-field pl-10' type='password' minLength={8} required />
                        </div>
                    </div>
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-1.5 block'>Confirm Password</label>
                        <div className='relative'>
                            <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className='input-field pl-10' type='password' minLength={8} required />
                        </div>
                        {confirm && password !== confirm && <p className='text-red-500 text-xs mt-1'>Passwords do not match</p>}
                    </div>
                    <button type='submit' disabled={loading || password !== confirm} className='btn-primary w-full py-3'>
                        {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
