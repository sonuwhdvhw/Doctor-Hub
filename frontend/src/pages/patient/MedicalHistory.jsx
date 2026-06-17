import { useEffect, useState } from 'react'

import { FileText, Lock } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'



const MedicalHistory = () => {

    const { backendUrl, token } = useAuth()

    const [history, setHistory] = useState([])

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await patientApi.getHistory(backendUrl, token)

                if (data.success) setHistory(data.history)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load history')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Medical History'

                subtitle='Read-only timeline of your visits'

            />



            <div className='mb-6'>

                <Badge variant='warning'>

                    <Lock size={12} className='mr-1' />

                    Records cannot be deleted

                </Badge>

            </div>



            {loading ? (

                <LoadingPage />

            ) : history.length === 0 ? (

                <EmptyState

                    icon={FileText}

                    title='No medical history'

                    description='Your visit records will appear here after completed appointments.'

                />

            ) : (

                <div className='relative ml-4'>

                    <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-brand-200' />

                    <div className='space-y-6'>

                        {history.map((record) => (

                            <div key={record.id} className='relative pl-8'>

                                <div className='absolute left-0 top-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-brand-600 ring-4 ring-white' />

                                <div className='card p-5'>

                                    <div className='flex items-start justify-between flex-wrap gap-2'>

                                        <div>

                                            <p className='font-semibold text-slate-900'>Dr. {record.doctorName}</p>

                                            <p className='text-sm text-slate-500'>{record.specialization}</p>

                                        </div>

                                        <Badge variant='neutral'>{record.visitDate}</Badge>

                                    </div>

                                    {record.symptoms && (

                                        <div className='mt-4'>

                                            <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold'>Symptoms</p>

                                            <p className='text-sm text-slate-700 mt-1'>{record.symptoms}</p>

                                        </div>

                                    )}

                                    {record.diagnosis && (

                                        <div className='mt-3'>

                                            <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold'>Diagnosis</p>

                                            <p className='text-sm text-slate-700 mt-1'>{record.diagnosis}</p>

                                        </div>

                                    )}

                                    {record.notes && (

                                        <div className='mt-3'>

                                            <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold'>Notes</p>

                                            <p className='text-sm text-slate-600 mt-1'>{record.notes}</p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    )

}



export default MedicalHistory

