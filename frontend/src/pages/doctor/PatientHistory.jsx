import { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'
import { ArrowLeft, ClipboardList, Pill } from 'lucide-react'



const PatientHistory = () => {

    const { patientId } = useParams()

    const { backendUrl, token } = useAuth()

    const [data, setData] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data: res } = await doctorApi.getPatientTimeline(backendUrl, token, patientId)

                if (res.success) setData(res)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load history')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token, patientId])



    if (loading) return <LoadingPage />



    return (

        <div className='animate-fade-in'>

            <Link to='/doctor/patients' className='btn-ghost -ml-2 mb-4 inline-flex'>

                <ArrowLeft size={16} /> Back to patients

            </Link>



            <PageHeader

                title='Patient History'

                subtitle={data?.patient ? `${data.patient.name} · ${data.patient.email}` : undefined}

            />



            {!data?.timeline?.length ? (

                <EmptyState

                    icon={ClipboardList}

                    title='No medical history yet'

                    description='Visit records will appear here after appointments are completed.'

                />

            ) : (

                <div className='relative border-l-2 border-brand-200 ml-3 pl-6 space-y-6'>

                    {data.timeline.map((visit) => (

                        <div key={visit.id} className='relative'>

                            <div className='absolute -left-[31px] w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white' />

                            <div className='card p-5'>

                                <div className='flex items-start justify-between flex-wrap gap-2'>

                                    <div>

                                        <p className='font-semibold text-slate-900'>Visit — {visit.visitDate}</p>

                                        <p className='text-xs text-slate-400 mt-0.5'>

                                            Recorded {new Date(visit.createdAt).toLocaleDateString()}

                                        </p>

                                    </div>

                                </div>



                                <div className='mt-4 space-y-3 text-sm'>

                                    <div>

                                        <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1'>Symptoms</p>

                                        <p className='text-slate-700'>{visit.symptoms}</p>

                                    </div>

                                    <div>

                                        <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1'>Diagnosis</p>

                                        <p className='text-slate-700'>{visit.diagnosis}</p>

                                    </div>

                                    {visit.notes && (

                                        <div>

                                            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1'>Notes</p>

                                            <p className='text-slate-600'>{visit.notes}</p>

                                        </div>

                                    )}

                                </div>



                                {visit.prescription ? (

                                    <div className='mt-5 pt-5 border-t border-slate-100'>

                                        <div className='flex items-center gap-2 mb-3'>

                                            <Pill size={16} className='text-brand-600' />

                                            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Prescription</p>

                                        </div>

                                        <div className='flex flex-col gap-2'>

                                            {(visit.prescription.medicines || []).map((med, i) => (

                                                <div key={i} className='bg-slate-50 rounded-xl p-3 text-sm ring-1 ring-slate-100'>

                                                    <p className='font-semibold text-slate-900'>{med.name}</p>

                                                    <p className='text-slate-500 mt-0.5'>

                                                        {med.dosage} · {med.frequency} · {med.duration}

                                                    </p>

                                                </div>

                                            ))}

                                        </div>

                                        {visit.prescription.instructions && (

                                            <p className='text-sm text-slate-600 mt-3'>

                                                <span className='text-slate-400 font-medium'>Instructions:</span>{' '}

                                                {visit.prescription.instructions}

                                            </p>

                                        )}

                                    </div>

                                ) : (

                                    <p className='mt-4 text-xs text-slate-400 italic'>No prescription for this visit</p>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default PatientHistory

