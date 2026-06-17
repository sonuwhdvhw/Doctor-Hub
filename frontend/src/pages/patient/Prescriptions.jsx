import { useEffect, useState } from 'react'

import { Pill, Lock, Download } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'



const PatientPrescriptions = () => {

    const { backendUrl, token } = useAuth()

    const [prescriptions, setPrescriptions] = useState([])

    const [loading, setLoading] = useState(true)



    const downloadPdf = async (id) => {
        try {
            const { data } = await patientApi.downloadPrescriptionPdf(backendUrl, token, id)
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
            const a = document.createElement('a')
            a.href = url
            a.download = `prescription-${id.slice(0, 8)}.pdf`
            a.click()
            window.URL.revokeObjectURL(url)
            toast.success('PDF downloaded')
        } catch {
            toast.error('Failed to download PDF')
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await patientApi.getPrescriptions(backendUrl, token)
                if (data.success) setPrescriptions(data.prescriptions)
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load prescriptions')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [backendUrl, token])



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Prescriptions'

                subtitle='Your prescribed medicines'

            />



            <div className='mb-6'>

                <Badge variant='warning'>

                    <Lock size={12} className='mr-1' />

                    Prescriptions cannot be edited after creation

                </Badge>

            </div>



            {loading ? (

                <LoadingPage />

            ) : prescriptions.length === 0 ? (

                <EmptyState

                    icon={Pill}

                    title='No prescriptions yet'

                    description='Prescriptions from your doctors will appear here.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 gap-4'>

                    {prescriptions.map((rx) => (

                        <div key={rx.id} className='card p-5'>

                            <div className='flex items-start justify-between flex-wrap gap-2'>

                                <div className='flex items-center gap-2'>

                                    <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white'>

                                        <Pill size={16} />

                                    </div>

                                    <p className='font-semibold text-slate-900'>Dr. {rx.doctorName}</p>

                                </div>

                                <Badge variant='neutral'>
                                    {new Date(rx.createdAt).toLocaleDateString()}
                                </Badge>
                                <button onClick={() => downloadPdf(rx.id)} className='btn-secondary text-xs py-1.5 px-3 mt-2'>
                                    <Download size={14} /> Download PDF
                                </button>

                            </div>

                            <div className='mt-4'>

                                <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2'>Medicines</p>

                                <div className='flex flex-col gap-2'>

                                    {(rx.medicines || []).map((med, i) => (

                                        <div key={i} className='bg-slate-50 rounded-xl p-3 text-sm'>

                                            <p className='font-medium text-slate-800'>{med.name || med.medicine || `Medicine ${i + 1}`}</p>

                                            {med.dosage && <p className='text-slate-500 mt-0.5'>Dosage: {med.dosage}</p>}

                                            {med.duration && <p className='text-slate-500'>Duration: {med.duration}</p>}

                                        </div>

                                    ))}

                                </div>

                            </div>

                            {rx.instructions && (

                                <div className='mt-4 pt-4 border-t border-slate-100'>

                                    <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold'>Instructions</p>

                                    <p className='text-sm text-slate-600 mt-1'>{rx.instructions}</p>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default PatientPrescriptions

