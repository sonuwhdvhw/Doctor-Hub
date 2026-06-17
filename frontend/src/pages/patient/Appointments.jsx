import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { CalendarCheck } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import DataTable from '../../components/ui/DataTable'

import EmptyState from '../../components/ui/EmptyState'



const statusVariants = {

    pending: 'warning',

    confirmed: 'info',

    completed: 'success',

    cancelled: 'danger',

}



const paymentVariants = {

    pending: 'warning',

    verified: 'success',

    rejected: 'danger',

}



const PatientAppointments = () => {

    const { backendUrl, token } = useAuth()

    const [appointments, setAppointments] = useState([])

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await patientApi.getAppointments(backendUrl, token)

                if (data.success) setAppointments(data.appointments)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load appointments')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='My Appointments'

                subtitle='Track your bookings and status'

                action={

                    <Link to='/patient/find-doctor' className='btn-primary'>

                        <CalendarCheck size={16} />

                        Book New

                    </Link>

                }

            />



            {loading ? (

                <LoadingPage />

            ) : appointments.length === 0 ? (

                <EmptyState

                    icon={CalendarCheck}

                    title='No appointments yet'

                    description='Book your first consultation with a verified doctor.'

                    action={<Link to='/patient/find-doctor' className='btn-primary'>Find a doctor</Link>}

                />

            ) : (

                <DataTable>

                    <thead>

                        <tr>

                            <th>Doctor</th>

                            <th>Date & Time</th>

                            <th>Clinic</th>

                            <th>Payment</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {appointments.map((a) => (

                            <tr key={a.id}>

                                <td>

                                    <p className='font-medium text-slate-900'>Dr. {a.doctorName}</p>

                                    <p className='text-xs text-slate-400'>{a.specialization}</p>

                                </td>

                                <td>

                                    <p className='text-slate-700'>{a.date}</p>

                                    <p className='text-xs text-slate-400'>{a.timeSlot}</p>

                                </td>

                                <td>

                                    <p className='text-slate-700'>{a.clinicName || '—'}</p>

                                    {a.clinicAddress && (

                                        <p className='text-xs text-slate-400'>{a.clinicAddress}</p>

                                    )}

                                </td>

                                <td>

                                    <p className='font-medium text-slate-700'>${a.amount}</p>

                                    <Badge variant={paymentVariants[a.paymentStatus] || 'neutral'}>

                                        {a.paymentStatus}

                                    </Badge>

                                </td>

                                <td>

                                    <Badge variant={statusVariants[a.status] || 'neutral'}>

                                        {a.status}

                                    </Badge>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}

        </div>

    )

}



export default PatientAppointments

