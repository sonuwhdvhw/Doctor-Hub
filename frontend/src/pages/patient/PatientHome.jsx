import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Calendar, Clock, History, Pill, Search, CalendarCheck, FileText } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import StatCard from '../../components/ui/StatCard'



const statCards = [

    { key: 'totalAppointments', label: 'Total Appointments', icon: Calendar, color: 'blue' },

    { key: 'upcomingAppointments', label: 'Upcoming', icon: Clock, color: 'green' },

    { key: 'historyRecords', label: 'History Records', icon: History, color: 'purple' },

    { key: 'prescriptions', label: 'Prescriptions', icon: Pill, color: 'orange' },

]



const quickLinks = [

    { to: '/patient/find-doctor', icon: Search, title: 'Find a Doctor', desc: 'Search and book consultations' },

    { to: '/patient/appointments', icon: CalendarCheck, title: 'My Appointments', desc: 'View booking status' },

    { to: '/patient/history', icon: FileText, title: 'Medical History', desc: 'Read-only visit records' },

]



const PatientHome = () => {

    const { backendUrl, token } = useAuth()

    const [stats, setStats] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await patientApi.getDashboard(backendUrl, token)

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

            <PageHeader title='Dashboard' subtitle='Your health overview' />



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



            <div className='mt-8 grid sm:grid-cols-3 gap-4'>

                {quickLinks.map((link) => (

                    <Link key={link.to} to={link.to} className='card-hover p-5 group'>

                        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform'>

                            <link.icon size={18} />

                        </div>

                        <h3 className='font-semibold text-slate-900'>{link.title}</h3>

                        <p className='text-sm text-slate-500 mt-1'>{link.desc}</p>

                    </Link>

                ))}

            </div>

        </div>

    )

}



export default PatientHome

