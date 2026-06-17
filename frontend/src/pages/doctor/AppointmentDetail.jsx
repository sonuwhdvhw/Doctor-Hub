import { useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { ArrowLeft, Calendar, FileText, History, AlertTriangle } from 'lucide-react'



const statusVariant = {

    pending: 'warning',

    confirmed: 'info',

    completed: 'success',

    cancelled: 'danger',

}



const AppointmentDetail = () => {

    const { appointmentId } = useParams()

    const navigate = useNavigate()

    const { backendUrl, token } = useAuth()

    const [appointment, setAppointment] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await doctorApi.getAppointments(backendUrl, token)

                if (data.success) {

                    const found = data.appointments.find((a) => a.id === appointmentId)

                    setAppointment(found || null)

                }

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load appointment')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token, appointmentId])



    if (loading) return <LoadingPage />



    if (!appointment) {

        return (

            <div className='animate-fade-in'>

                <Link to='/doctor/appointments' className='btn-ghost -ml-2 mb-4 inline-flex'>

                    <ArrowLeft size={16} /> Back to appointments

                </Link>

                <EmptyState

                    icon={Calendar}

                    title='Appointment not found'

                    description='This appointment may have been removed or the link is invalid.'

                    action={

                        <Link to='/doctor/appointments' className='btn-primary'>View All Appointments</Link>

                    }

                />

            </div>

        )

    }



    const canAddRecord = ['confirmed', 'completed'].includes(appointment.status)



    return (

        <div className='animate-fade-in'>

            <Link to='/doctor/appointments' className='btn-ghost -ml-2 mb-4 inline-flex'>

                <ArrowLeft size={16} /> Back to appointments

            </Link>



            <PageHeader title='Appointment Details' />



            <div className='card p-6 max-w-lg'>

                <div className='space-y-4 text-sm'>

                    <div className='flex items-center justify-between'>

                        <span className='text-slate-500'>Status</span>

                        <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>

                    </div>

                    <div className='border-t border-slate-100 pt-4 space-y-3'>

                        <div className='flex justify-between gap-4'>

                            <span className='text-slate-500 shrink-0'>Patient</span>

                            <span className='font-semibold text-slate-900 text-right'>{appointment.patientName}</span>

                        </div>

                        <div className='flex justify-between gap-4'>

                            <span className='text-slate-500 shrink-0'>Email</span>

                            <span className='text-slate-700 text-right'>{appointment.patientEmail}</span>

                        </div>

                        <div className='flex justify-between gap-4'>

                            <span className='text-slate-500 shrink-0'>Date & Time</span>

                            <span className='text-slate-700 text-right'>{appointment.date} at {appointment.time}</span>

                        </div>

                        <div className='flex justify-between gap-4'>

                            <span className='text-slate-500 shrink-0'>Payment</span>

                            <span className='capitalize text-slate-700 text-right'>{appointment.paymentStatus}</span>

                        </div>

                        <div className='flex justify-between gap-4'>

                            <span className='text-slate-500 shrink-0'>Fee</span>

                            <span className='font-semibold text-slate-900 text-right'>${appointment.amount}</span>

                        </div>

                    </div>

                </div>



                {canAddRecord ? (

                    <div className='mt-6 flex flex-col gap-3'>

                        <button

                            onClick={() => navigate(`/doctor/appointments/${appointmentId}/medical-record`, {

                                state: { appointment },

                            })}

                            className='btn-primary w-full'

                        >

                            <FileText size={16} /> Add Medical Record

                        </button>

                        <Link

                            to={`/doctor/patients/${appointment.patientId}/history`}

                            className='btn-secondary w-full'

                        >

                            <History size={16} /> View Patient History

                        </Link>

                    </div>

                ) : (

                    <div className='mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 ring-1 ring-amber-600/20'>

                        <AlertTriangle size={18} className='text-amber-600 shrink-0 mt-0.5' />

                        <p className='text-sm text-amber-700'>

                            Medical records can only be added for confirmed or completed appointments.

                        </p>

                    </div>

                )}

            </div>

        </div>

    )

}



export default AppointmentDetail

