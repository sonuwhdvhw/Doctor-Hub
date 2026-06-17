import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { assistantApi } from '../../utils/assistantApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import DataTable from '../../components/ui/DataTable'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { CalendarDays } from 'lucide-react'



const statusVariant = {

    pending: 'warning',

    confirmed: 'info',

    completed: 'success',

    cancelled: 'danger',

}



const AssistantAppointments = () => {

    const { backendUrl, token } = useAuth()

    const [appointments, setAppointments] = useState([])

    const [loading, setLoading] = useState(true)

    const [filter, setFilter] = useState('all')



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await assistantApi.getAppointments(backendUrl, token)

                if (data.success) setAppointments(data.appointments)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load appointments')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    const filtered = filter === 'all'

        ? appointments

        : appointments.filter((a) => a.status === filter)



    return (

        <div>

            <PageHeader

                title='All Appointments'

                subtitle='Appointments for your assigned doctor'

            />



            <div className='flex gap-2 mb-6 flex-wrap'>

                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (

                    <button

                        key={f}

                        onClick={() => setFilter(f)}

                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${

                            filter === f

                                ? 'bg-brand-600 text-white shadow-sm'

                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                        }`}

                    >

                        {f}

                    </button>

                ))}

            </div>



            {loading ? (

                <LoadingPage />

            ) : filtered.length === 0 ? (

                <EmptyState

                    icon={CalendarDays}

                    title='No appointments found'

                    description='Appointments will appear here once patients book with your doctor.'

                />

            ) : (

                <DataTable>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Date & Time</th>

                            <th>Clinic</th>

                            <th>Status</th>

                            <th>Payment</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((a) => (

                            <tr key={a.id}>

                                <td>

                                    <p className='font-medium text-slate-800'>{a.patientName}</p>

                                    <p className='text-xs text-slate-400'>{a.patientEmail}</p>

                                </td>

                                <td className='text-slate-600'>{a.date} · {a.timeSlot}</td>

                                <td className='text-slate-600'>{a.clinicName || '—'}</td>

                                <td>

                                    <Badge variant={statusVariant[a.status] || 'neutral'}>

                                        {a.status}

                                    </Badge>

                                </td>

                                <td className='capitalize text-slate-600'>{a.paymentStatus}</td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}

        </div>

    )

}



export default AssistantAppointments

