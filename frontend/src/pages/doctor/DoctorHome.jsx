import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import { Link } from 'react-router-dom'

import PageHeader from '../../components/ui/PageHeader'

import StatCard from '../../components/ui/StatCard'

import {

    Calendar,

    CalendarCheck,

    Users,

    CreditCard,

    UserCircle,

    Building2,

    CalendarDays,

    ArrowRight,

} from 'lucide-react'



const statCards = [

    { key: 'totalAppointments', label: 'Total Appointments', icon: Calendar, color: 'blue' },

    { key: 'todayAppointments', label: "Today's Appointments", icon: CalendarCheck, color: 'green' },

    { key: 'totalPatients', label: 'Total Patients', icon: Users, color: 'purple' },

    { key: 'pendingPayments', label: 'Pending Payments', icon: CreditCard, color: 'orange' },

]



const quickActions = [

    { to: '/doctor/profile', icon: UserCircle, title: 'Setup Profile', desc: 'Add specialization, fee & bio' },

    { to: '/doctor/clinics', icon: Building2, title: 'Add Clinic', desc: 'Register your clinic locations' },

    { to: '/doctor/schedule', icon: CalendarDays, title: 'Manage Schedule', desc: 'Set available dates & slots' },

]



const DoctorHome = () => {

    const { backendUrl, token } = useAuth()

    const [stats, setStats] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await doctorApi.getDashboard(backendUrl, token)

                if (data.success) setStats(data.stats)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load dashboard')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Dashboard'

                subtitle='Overview of your practice'

            />



            {loading ? (

                <LoadingPage />

            ) : (

                <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>

                    {statCards.map((card) => (

                        <StatCard

                            key={card.key}

                            label={card.label}

                            value={stats?.[card.key] ?? 0}

                            icon={card.icon}

                            color={card.color}

                        />

                    ))}

                </div>

            )}



            <div className='mt-8'>

                <h2 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4'>Quick Actions</h2>

                <div className='grid sm:grid-cols-3 gap-4'>

                    {quickActions.map(({ to, icon: Icon, title, desc }) => (

                        <Link key={to} to={to} className='card-hover p-5 group'>

                            <div className='flex items-start justify-between'>

                                <div className='p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors'>

                                    <Icon size={20} />

                                </div>

                                <ArrowRight size={16} className='text-slate-300 group-hover:text-brand-500 transition-colors mt-1' />

                            </div>

                            <h3 className='font-semibold text-slate-900 mt-4'>{title}</h3>

                            <p className='text-sm text-slate-500 mt-1'>{desc}</p>

                        </Link>

                    ))}

                </div>

            </div>

        </div>

    )

}



export default DoctorHome

