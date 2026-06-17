import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'

import { Users, ArrowRight, Calendar } from 'lucide-react'



const DoctorPatients = () => {

    const { backendUrl, token } = useAuth()

    const [patients, setPatients] = useState([])

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await doctorApi.getPatients(backendUrl, token)

                if (data.success) setPatients(data.patients)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load patients')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Patients'

                subtitle='Patients who have visited your practice'

            />



            {loading ? (

                <LoadingPage />

            ) : patients.length === 0 ? (

                <EmptyState

                    icon={Users}

                    title='No patients yet'

                    description='Patients will appear here after their first appointment with you.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>

                    {patients.map((p) => (

                        <div key={p.id} className='card-hover p-5'>

                            <div className='flex items-center gap-3'>

                                <div className='w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-semibold text-lg shrink-0'>

                                    {p.name?.charAt(0)?.toUpperCase()}

                                </div>

                                <div className='min-w-0'>

                                    <p className='font-semibold text-slate-900 truncate'>{p.name}</p>

                                    <p className='text-xs text-slate-500 truncate'>{p.email}</p>

                                </div>

                            </div>

                            <div className='mt-4 pt-4 border-t border-slate-100 flex items-center justify-between'>

                                <div className='text-sm text-slate-500 flex flex-col gap-0.5'>

                                    <span className='flex items-center gap-1.5'>

                                        <Calendar size={13} />

                                        {p.visitCount} visit{p.visitCount !== 1 ? 's' : ''}

                                    </span>

                                    <span className='text-xs'>Last: {p.lastVisit}</span>

                                </div>

                                <Link

                                    to={`/doctor/patients/${p.id}/history`}

                                    className='inline-flex items-center gap-1 text-brand-600 text-sm font-medium hover:text-brand-700'

                                >

                                    History

                                    <ArrowRight size={14} />

                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default DoctorPatients

