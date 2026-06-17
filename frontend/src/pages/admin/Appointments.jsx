import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { adminApi } from '../../utils/adminApi'

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



const AdminAppointments = () => {

    const { backendUrl, token } = useAuth()

    const [appointments, setAppointments] = useState([])

    const [loading, setLoading] = useState(true)

    const [date, setDate] = useState('')

    const [status, setStatus] = useState('')



    const load = async () => {

        setLoading(true)

        try {

            const params = {}

            if (date) params.date = date

            if (status) params.status = status

            const { data } = await adminApi.getAppointments(backendUrl, token, params)

            if (data.success) setAppointments(data.appointments)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load appointments')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { load() }, [backendUrl, token])



    return (

        <div>

            <PageHeader

                title='Appointments'

                subtitle='All platform appointments'

            />



            <div className='flex flex-wrap gap-3 mb-6'>

                <input

                    type='date'

                    value={date}

                    onChange={(e) => setDate(e.target.value)}

                    className='input-field w-auto'

                />

                <select

                    value={status}

                    onChange={(e) => setStatus(e.target.value)}

                    className='input-field w-auto'

                >

                    <option value=''>All statuses</option>

                    {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (

                        <option key={s} value={s}>{s}</option>

                    ))}

                </select>

                <button onClick={load} className='btn-primary'>Filter</button>

            </div>



            {loading ? (

                <LoadingPage />

            ) : appointments.length === 0 ? (

                <EmptyState

                    icon={CalendarDays}

                    title='No appointments found'

                    description='Try adjusting your date or status filters.'

                />

            ) : (

                <DataTable minWidth='700px'>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Doctor</th>

                            <th>Date & Time</th>

                            <th>Status</th>

                            <th>Payment</th>

                        </tr>

                    </thead>

                    <tbody>

                        {appointments.map((a) => (

                            <tr key={a.id}>

                                <td className='text-slate-800'>{a.patientName}</td>

                                <td>

                                    <p className='text-slate-800'>{a.doctorName}</p>

                                    <p className='text-xs text-slate-400'>{a.specialization}</p>

                                </td>

                                <td className='text-slate-600'>{a.date} · {a.timeSlot}</td>

                                <td>

                                    <Badge variant={statusVariant[a.status] || 'neutral'}>

                                        {a.status}

                                    </Badge>

                                </td>

                                <td className='capitalize text-slate-600'>${a.amount} · {a.paymentStatus}</td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}

        </div>

    )

}



export default AdminAppointments

