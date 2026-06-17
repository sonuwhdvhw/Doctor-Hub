import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { assistantApi } from '../../utils/assistantApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import StatCard from '../../components/ui/StatCard'

import { CreditCard, CalendarDays, CheckCircle2, ClipboardList, ArrowRight } from 'lucide-react'



const statCards = [

    { key: 'pendingPayments', label: 'Pending Payments', icon: CreditCard, color: 'orange' },

    { key: 'todayAppointments', label: "Today's Appointments", icon: CalendarDays, color: 'blue' },

    { key: 'confirmedToday', label: 'Confirmed Today', icon: CheckCircle2, color: 'green' },

    { key: 'totalAppointments', label: 'Total Appointments', icon: ClipboardList, color: 'purple' },

]



const AssistantHome = () => {

    const { backendUrl, token } = useAuth()

    const [stats, setStats] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await assistantApi.getDashboard(backendUrl, token)

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

        <div>

            <PageHeader

                title='Dashboard'

                subtitle='Overview for your assigned doctor'

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



            {stats?.pendingPayments > 0 && (

                <Link

                    to='/assistant/pending-payments'

                    className='btn-primary mt-6 inline-flex'

                >

                    Review {stats.pendingPayments} pending payment{stats.pendingPayments !== 1 ? 's' : ''}

                    <ArrowRight size={16} />

                </Link>

            )}

        </div>

    )

}



export default AssistantHome

