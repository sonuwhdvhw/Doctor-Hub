import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { adminApi } from '../../utils/adminApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'

import { Users } from 'lucide-react'



const AdminPatients = () => {

    const { backendUrl, token } = useAuth()

    const [patients, setPatients] = useState([])

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await adminApi.getPatients(backendUrl, token)

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

        <div>

            <PageHeader

                title='Patients'

                subtitle='All registered patients'

            />



            {loading ? (

                <LoadingPage />

            ) : patients.length === 0 ? (

                <EmptyState

                    icon={Users}

                    title='No patients found'

                    description='Registered patients will appear here.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 gap-4'>

                    {patients.map((p) => (

                        <div key={p.id} className='card p-5 hover:shadow-card-hover transition-all duration-300'>

                            <div className='flex items-center gap-3'>

                                <div className='w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-semibold'>

                                    {p.name?.charAt(0)?.toUpperCase() || 'P'}

                                </div>

                                <div>

                                    <p className='font-semibold text-slate-800'>{p.name}</p>

                                    <p className='text-xs text-slate-500'>{p.email}</p>

                                </div>

                            </div>

                            <div className='mt-3 text-sm text-slate-500 flex flex-wrap gap-3'>

                                {p.age && <span>Age: {p.age}</span>}

                                {p.bloodGroup && <span>Blood: {p.bloodGroup}</span>}

                                {p.phone && <span>{p.phone}</span>}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default AdminPatients

