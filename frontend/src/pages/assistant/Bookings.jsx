import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { assistantApi } from '../../utils/assistantApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { BookOpen } from 'lucide-react'



const paymentStatusVariant = {

    pending: 'warning',

    verified: 'success',

    rejected: 'danger',

}



const statusVariant = {

    pending: 'warning',

    confirmed: 'info',

    completed: 'success',

    cancelled: 'danger',

}



const AssistantBookings = () => {

    const { backendUrl, token } = useAuth()

    const [bookings, setBookings] = useState([])

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await assistantApi.getBookings(backendUrl, token)

                if (data.success) setBookings(data.bookings)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load bookings')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div>

            <PageHeader

                title='Bookings'

                subtitle='All bookings with payment details'

            />



            {loading ? (

                <LoadingPage />

            ) : bookings.length === 0 ? (

                <EmptyState

                    icon={BookOpen}

                    title='No bookings yet'

                    description='Bookings will appear here once patients schedule appointments.'

                />

            ) : (

                <div className='flex flex-col gap-3'>

                    {bookings.map((b) => (

                        <div key={b.id} className='card p-5 hover:shadow-card-hover transition-all duration-300'>

                            <div className='flex items-start justify-between flex-wrap gap-2'>

                                <div>

                                    <p className='font-semibold text-slate-800'>{b.patientName}</p>

                                    <p className='text-sm text-slate-500'>

                                        {b.date} at {b.timeSlot} · {b.clinicName || 'No clinic'}

                                    </p>

                                </div>

                                <Badge variant={statusVariant[b.status] || 'neutral'}>{b.status}</Badge>

                            </div>

                            <div className='mt-3 flex flex-wrap gap-4 text-sm text-slate-600'>

                                <span>Amount: <span className='font-semibold text-slate-800'>${b.amount}</span></span>

                                <span className='capitalize'>Appt payment: {b.paymentStatus}</span>

                                {b.payment && (

                                    <Badge variant={paymentStatusVariant[b.payment.status] || 'neutral'}>

                                        Screenshot: {b.payment.status}

                                    </Badge>

                                )}

                            </div>

                            {b.payment?.rejectionReason && (

                                <p className='text-xs text-red-600 mt-2 bg-red-50 rounded-lg px-3 py-2'>

                                    Rejected: {b.payment.rejectionReason}

                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default AssistantBookings

