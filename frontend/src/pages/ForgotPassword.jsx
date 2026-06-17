import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ForgotPassword = () => {
    const { forgotPassword, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [resetLink, setResetLink] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        const result = await forgotPassword(email)
        if (result.success && result.resetLink) setResetLink(result.resetLink)
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md animate-slide-up'>
                <div className='text-center mb-8'>
                    <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow mb-4'>
                        <Stethoscope size={24} className='text-white' />
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>Reset password</h1>
                    <p className='text-slate-500 text-sm mt-2'>We'll send you a link to reset your password</p>
                </div>

                <form onSubmit={onSubmit} className='card p-8 space-y-5'>
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-1.5 block'>Email</label>
                        <div className='relative'>
                            <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className='input-field pl-10' type='email' required placeholder='you@email.com' />
                        </div>
                    </div>

                    <button type='submit' disabled={loading} className='btn-primary w-full py-3'>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                        {!loading && <ArrowRight size={16} />}
                    </button>

                    {resetLink && (
                        <div className='bg-brand-50 border border-brand-200 rounded-xl p-3 text-xs text-brand-800 break-all'>
                            Dev mock link: <span className='font-semibold'>{resetLink}</span>
                        </div>
                    )}
                </form>

                <p className='text-center text-sm text-slate-500 mt-6'>
                    <Link to='/login' className='text-brand-600 font-semibold hover:text-brand-700'>Back to sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword
