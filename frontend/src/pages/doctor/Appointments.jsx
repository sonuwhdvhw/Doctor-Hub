import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import DataTable from '../../components/ui/DataTable'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { Calendar, ArrowRight } from 'lucide-react'



const statusVariant = {

    pending: 'warning',

    confirmed: 'info',

    completed: 'success',

    cancelled: 'danger',

}



const DoctorAppointments = () => {

    const { backendUrl, token } = useAuth()

    const [appointments, setAppointments] = useState([])

    const [loading, setLoading] = useState(true)

    const [filter, setFilter] = useState('all')



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await doctorApi.getAppointments(backendUrl, token)

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

        <div className='animate-fade-in'>

            <PageHeader

                title='Appointments'

                subtitle='Click an appointment to add medical records'

            />



            <div className='flex gap-2 mb-6 flex-wrap'>

                {['all', 'pending', 'confirmed', 'completed'].map((f) => (

                    <button

                        key={f}

                        onClick={() => setFilter(f)}

                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${

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

                    icon={Calendar}

                    title='No appointments found'

                    description={filter === 'all' ? 'Appointments will appear here once patients book with you.' : `No ${filter} appointments at the moment.`}

                />

            ) : (

                <DataTable>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Date</th>

                            <th>Time</th>

                            <th>Status</th>

                            <th>Payment</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((a) => (

                            <tr key={a.id}>

                                <td>

                                    <p className='font-medium text-slate-900'>{a.patientName}</p>

                                    <p className='text-xs text-slate-400 mt-0.5'>{a.patientEmail}</p>

                                </td>

                                <td className='text-slate-700'>{a.date}</td>

                                <td className='text-slate-700'>{a.time}</td>

                                <td>

                                    <Badge variant={statusVariant[a.status] || 'neutral'}>

                                        {a.status}

                                    </Badge>

                                </td>

                                <td className='capitalize text-slate-700'>{a.paymentStatus}</td>

                                <td>

                                    <Link

                                        to={`/doctor/appointments/${a.id}`}

                                        className='inline-flex items-center gap-1 text-brand-600 text-sm font-medium hover:text-brand-700'

                                    >

                                        {['confirmed', 'completed'].includes(a.status) ? 'Add Record' : 'View'}

                                        <ArrowRight size={14} />

                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}

        </div>

    )

}



export default DoctorAppointments

