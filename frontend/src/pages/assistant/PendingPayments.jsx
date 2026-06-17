import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { assistantApi } from '../../utils/assistantApi'

import { LoadingPage } from '../../components/Spinner'

import ConfirmModal from '../../components/ConfirmModal'

import PageHeader from '../../components/ui/PageHeader'

import DataTable from '../../components/ui/DataTable'

import EmptyState from '../../components/ui/EmptyState'

import { toast } from 'react-toastify'

import { CreditCard } from 'lucide-react'



const PendingPayments = () => {

    const { backendUrl, token } = useAuth()

    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(true)

    const [processing, setProcessing] = useState(false)

    const [modal, setModal] = useState(null)

    const [rejectReason, setRejectReason] = useState('')

    const [previewUrl, setPreviewUrl] = useState(null)



    const loadPayments = async () => {

        try {

            const { data } = await assistantApi.getPendingPayments(backendUrl, token)

            if (data.success) setPayments(data.payments)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load payments')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { loadPayments() }, [backendUrl, token])



    const handleVerify = async () => {

        if (!modal?.payment) return

        setProcessing(true)

        try {

            const { data } = await assistantApi.verifyPayment(backendUrl, token, modal.payment.id)

            if (data.success) {

                toast.success(data.message)

                setModal(null)

                loadPayments()

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setProcessing(false)

        }

    }



    const handleReject = async () => {

        if (!modal?.payment || !rejectReason.trim()) {

            toast.error('Please enter a rejection reason')

            return

        }

        setProcessing(true)

        try {

            const { data } = await assistantApi.rejectPayment(backendUrl, token, modal.payment.id, rejectReason)

            if (data.success) {

                toast.success(data.message)

                setModal(null)

                setRejectReason('')

                loadPayments()

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setProcessing(false)

        }

    }



    return (

        <div>

            <PageHeader

                title='Pending Payments'

                subtitle='Verify or reject payment screenshots'

            />



            {loading ? (

                <LoadingPage />

            ) : payments.length === 0 ? (

                <EmptyState

                    icon={CreditCard}

                    title='No pending payments'

                    description='All payment screenshots have been reviewed.'

                />

            ) : (

                <DataTable>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Appointment</th>

                            <th>Amount</th>

                            <th>Screenshot</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {payments.map((p) => (

                            <tr key={p.id}>

                                <td>

                                    <p className='font-medium text-slate-800'>{p.patientName}</p>

                                    <p className='text-xs text-slate-400'>{p.patientEmail}</p>

                                </td>

                                <td className='text-slate-600'>

                                    {p.appointmentDate}<br />

                                    <span className='text-slate-500'>{p.appointmentTime}</span>

                                </td>

                                <td className='font-semibold text-slate-800'>${p.amount}</td>

                                <td>

                                    <button

                                        onClick={() => setPreviewUrl(p.screenshotUrl)}

                                        className='text-brand-600 hover:text-brand-700 text-xs font-semibold underline'

                                    >

                                        View Screenshot

                                    </button>

                                </td>

                                <td>

                                    <div className='flex gap-2'>

                                        <button

                                            onClick={() => setModal({ type: 'verify', payment: p })}

                                            className='btn-primary !px-3 !py-1.5 text-xs'

                                        >

                                            Verify

                                        </button>

                                        <button

                                            onClick={() => { setRejectReason(''); setModal({ type: 'reject', payment: p }) }}

                                            className='btn-danger !px-3 !py-1.5 text-xs'

                                        >

                                            Reject

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </DataTable>

            )}



            <ConfirmModal

                open={modal?.type === 'verify'}

                title='Verify Payment'

                message={`Confirm payment of $${modal?.payment?.amount} from ${modal?.payment?.patientName}? Appointment will be marked as confirmed.`}

                confirmLabel={processing ? 'Processing...' : 'Verify Payment'}

                onConfirm={handleVerify}

                onCancel={() => setModal(null)}

                loading={processing}

            />



            <ConfirmModal

                open={modal?.type === 'reject'}

                title='Reject Payment'

                message={`Reject payment from ${modal?.payment?.patientName}?`}

                confirmLabel={processing ? 'Processing...' : 'Reject Payment'}

                danger

                onConfirm={handleReject}

                onCancel={() => { setModal(null); setRejectReason('') }}

                loading={processing}

            >

                <textarea

                    value={rejectReason}

                    onChange={(e) => setRejectReason(e.target.value)}

                    placeholder='Enter rejection reason...'

                    className='input-field mt-4'

                    rows={3}

                />

            </ConfirmModal>



            {previewUrl && (

                <div

                    className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in'

                    onClick={() => setPreviewUrl(null)}

                >

                    <img

                        src={previewUrl}

                        alt='Payment screenshot'

                        className='max-w-full max-h-[85vh] rounded-2xl shadow-card-hover'

                        onClick={(e) => e.stopPropagation()}

                    />

                </div>

            )}

        </div>

    )

}



export default PendingPayments

