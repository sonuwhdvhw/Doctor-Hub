import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { adminApi } from '../../utils/adminApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import DataTable from '../../components/ui/DataTable'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { CreditCard } from 'lucide-react'



const paymentVariant = {

    pending: 'warning',

    verified: 'success',

    rejected: 'danger',

}



const AdminPayments = () => {

    const { backendUrl, token } = useAuth()

    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(true)

    const [previewUrl, setPreviewUrl] = useState(null)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await adminApi.getPayments(backendUrl, token)

                if (data.success) setPayments(data.payments)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load payments')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    return (

        <div>

            <PageHeader

                title='Payments'

                subtitle='All payment records'

            />



            {loading ? (

                <LoadingPage />

            ) : payments.length === 0 ? (

                <EmptyState

                    icon={CreditCard}

                    title='No payments found'

                    description='Payment records will appear here once patients submit screenshots.'

                />

            ) : (

                <DataTable minWidth='700px'>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Appointment</th>

                            <th>Amount</th>

                            <th>Status</th>

                            <th>Screenshot</th>

                        </tr>

                    </thead>

                    <tbody>

                        {payments.map((p) => (

                            <tr key={p.id}>

                                <td>

                                    <p className='font-medium text-slate-800'>{p.patientName}</p>

                                    <p className='text-xs text-slate-400'>{p.patientEmail}</p>

                                </td>

                                <td className='text-slate-600'>{p.appointmentDate} · {p.appointmentTime}</td>

                                <td className='font-semibold text-slate-800'>${p.amount}</td>

                                <td>

                                    <Badge variant={paymentVariant[p.status] || 'neutral'}>

                                        {p.status}

                                    </Badge>

                                </td>

                                <td>

                                    <button

                                        onClick={() => setPreviewUrl(p.screenshotUrl)}

                                        className='text-brand-600 hover:text-brand-700 text-xs font-semibold underline'

                                    >

                                        View

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}



            {previewUrl && (

                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in' onClick={() => setPreviewUrl(null)}>

                    <img src={previewUrl} alt='Payment' className='max-w-full max-h-[85vh] rounded-2xl shadow-card-hover' onClick={(e) => e.stopPropagation()} />

                </div>

            )}

        </div>

    )

}



export default AdminPayments

