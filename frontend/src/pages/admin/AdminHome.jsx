import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { adminApi } from '../../utils/adminApi'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import StatCard from '../../components/ui/StatCard'

import { toast } from 'react-toastify'

import {

    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,

    PieChart, Pie, Cell, Legend,

} from 'recharts'

import { Stethoscope, Users, CalendarDays, DollarSign } from 'lucide-react'



const COLORS = ['#0891b2', '#10b981', '#f59e0b', '#8b5cf6']



const formatTreatmentLabel = (type) => {

    const labels = { allopathic: 'Allopathic', homeopathic: 'Homeopathic', herbal: 'Herbal', unset: 'Unset' }

    return labels[type] || type

}



const AdminHome = () => {

    const { backendUrl, token } = useAuth()

    const [analytics, setAnalytics] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await adminApi.getAnalytics(backendUrl, token)

                if (data.success) setAnalytics(data.analytics)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load analytics')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    if (loading) return <LoadingPage message='Loading analytics...' />



    const stats = [

        { label: 'Total Doctors', value: analytics?.totalDoctors ?? 0, icon: Stethoscope, color: 'cyan' },

        { label: 'Total Patients', value: analytics?.totalPatients ?? 0, icon: Users, color: 'blue' },

        { label: 'Appointments Today', value: analytics?.todayAppointments ?? 0, icon: CalendarDays, color: 'green' },

        { label: 'Total Revenue', value: `$${(analytics?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: 'orange' },

    ]



    const barData = (analytics?.appointmentsPerDay || []).map((d) => ({

        name: d.date?.slice(5) || d.date,

        appointments: d.count,

    }))



    const pieData = (analytics?.treatmentTypes || [])

        .filter((t) => t.type !== 'unset')

        .map((t) => ({

            name: formatTreatmentLabel(t.type),

            value: t.count,

        }))



    return (

        <div>

            <PageHeader

                title='Analytics Dashboard'

                subtitle='System-wide overview'

            />



            <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8'>

                {stats.map((s) => (

                    <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />

                ))}

            </div>



            <div className='grid lg:grid-cols-2 gap-4 sm:gap-6'>

                <div className='card p-4 sm:p-5 overflow-hidden'>

                    <h3 className='font-semibold text-slate-800 mb-4 text-sm sm:text-base'>

                        Appointments per Day (Last 7 Days)

                    </h3>

                    <div className='h-64'>

                        <ResponsiveContainer width='100%' height='100%'>

                            <BarChart data={barData}>

                                <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />

                                <XAxis dataKey='name' tick={{ fontSize: 11, fill: '#64748b' }} />

                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />

                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />

                                <Bar dataKey='appointments' fill='#0891b2' radius={[4, 4, 0, 0]} />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>



                <div className='card p-4 sm:p-5 overflow-hidden'>

                    <h3 className='font-semibold text-slate-800 mb-4 text-sm sm:text-base'>

                        Doctors by Treatment Type

                    </h3>

                    <div className='h-64'>

                        {pieData.length > 0 ? (

                            <ResponsiveContainer width='100%' height='100%'>

                                <PieChart>

                                    <Pie

                                        data={pieData}

                                        dataKey='value'

                                        nameKey='name'

                                        cx='50%'

                                        cy='50%'

                                        outerRadius={80}

                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

                                    >

                                        {pieData.map((_, i) => (

                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />

                                        ))}

                                    </Pie>

                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <p className='text-slate-400 text-sm text-center py-16'>No treatment data yet</p>

                        )}

                    </div>

                </div>

            </div>

        </div>

    )

}



export default AdminHome

