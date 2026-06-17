import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Brain, Search, AlertTriangle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { toast } from 'react-toastify'

const urgencyVariant = { high: 'danger', moderate: 'warning', low: 'info' }

const SymptomChecker = () => {
    const { backendUrl } = useAuth()
    const navigate = useNavigate()
    const [symptoms, setSymptoms] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const analyze = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/ai/symptoms`, { symptoms })
            if (data.success) setResult(data)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Analysis failed')
        } finally {
            setLoading(false)
        }
    }

    const findDoctor = (type, specialty) => {
        const params = new URLSearchParams()
        if (type) params.set('type', type)
        if (specialty) params.set('search', specialty)
        navigate(`/patient/find-doctor?${params.toString()}`)
    }

    return (
        <div className='animate-fade-in'>
            <PageHeader title='AI Symptom Checker' subtitle='Describe your symptoms for preliminary health guidance' />

            <form onSubmit={analyze} className='card p-6 mb-6'>
                <label className='text-sm font-medium text-slate-700 mb-2 block'>Your Symptoms</label>
                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className='input-field min-h-[120px] resize-y'
                    placeholder='e.g. fever, cough, sore throat, headache...'
                    required
                />
                <p className='text-xs text-slate-400 mt-2'>Separate multiple symptoms with commas</p>
                <button type='submit' disabled={loading} className='btn-primary mt-4'>
                    <Brain size={16} /> {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>
            </form>

            {result && (
                <div className='space-y-4'>
                    <div className='card p-4 bg-amber-50 border-amber-200 flex gap-3'>
                        <AlertTriangle size={20} className='text-amber-600 shrink-0 mt-0.5' />
                        <p className='text-sm text-amber-800'>{result.disclaimer}</p>
                    </div>

                    {result.recommendation && (
                        <div className='card p-6'>
                            <h3 className='font-bold text-slate-900 mb-2'>Recommendation</h3>
                            <p className='text-slate-600 text-sm'>{result.recommendation.message}</p>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                <Badge variant={urgencyVariant[result.recommendation.urgency] || 'info'}>
                                    Urgency: {result.recommendation.urgency}
                                </Badge>
                                <Badge variant='brand'>{result.recommendation.specialty}</Badge>
                                <Badge variant='neutral' className='capitalize'>{result.recommendation.treatmentType}</Badge>
                            </div>
                            <button
                                onClick={() => findDoctor(result.recommendation.treatmentType, result.recommendation.specialty)}
                                className='btn-primary mt-4'
                            >
                                <Search size={16} /> Find Recommended Doctor <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {result.predictions?.map((p, i) => (
                        <div key={i} className='card p-6'>
                            <div className='flex items-center justify-between flex-wrap gap-2'>
                                <h3 className='font-bold text-slate-900'>Possible: {p.possibleConditions.join(', ')}</h3>
                                <Badge variant='brand'>{p.confidence}% match</Badge>
                            </div>
                            <p className='text-sm text-slate-500 mt-2'>Matched: {p.matchedSymptoms.join(', ')}</p>
                            <p className='text-sm text-slate-600 mt-3'>{p.advice}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SymptomChecker
