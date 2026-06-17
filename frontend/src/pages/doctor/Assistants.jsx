import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { doctorApi } from '../../utils/doctorApi'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmModal from '../../components/ConfirmModal'
import DataTable from '../../components/ui/DataTable'
import EmptyState from '../../components/ui/EmptyState'
import { LoadingPage } from '../../components/Spinner'
import { UserPlus, Users } from 'lucide-react'
import { toast } from 'react-toastify'

const Assistants = () => {
    const { backendUrl, token } = useAuth()
    const [assistants, setAssistants] = useState([])
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [processing, setProcessing] = useState(false)

    const load = async () => {
        try {
            const { data } = await doctorApi.getAssistants(backendUrl, token)
            if (data.success) setAssistants(data.assistants)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load assistants')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [backendUrl, token])

    const handleAssign = async (e) => {
        e.preventDefault()
        try {
            const { data } = await doctorApi.assignAssistant(backendUrl, token, email)
            if (data.success) {
                toast.success(data.message)
                setEmail('')
                load()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleRemove = async () => {
        if (!modal) return
        setProcessing(true)
        try {
            const { data } = await doctorApi.removeAssistant(backendUrl, token, modal.id)
            if (data.success) {
                toast.success(data.message)
                setModal(null)
                load()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className='animate-fade-in'>
            <PageHeader title='Manage Assistants' subtitle='Assign assistants to verify payments and manage bookings' />

            <form onSubmit={handleAssign} className='card p-6 mb-6 flex flex-col sm:flex-row gap-3'>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='input-field flex-1' type='email' placeholder='Assistant email address' required />
                <button type='submit' className='btn-primary shrink-0'><UserPlus size={16} /> Assign Assistant</button>
            </form>

            {loading ? <LoadingPage /> : assistants.length === 0 ? (
                <EmptyState icon={Users} title='No assistants assigned' description='Enter the email of a registered assistant to assign them to your clinic.' />
            ) : (
                <DataTable>
                    <thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead>
                    <tbody>
                        {assistants.map((a) => (
                            <tr key={a.id}>
                                <td className='font-medium'>{a.name}</td>
                                <td className='text-slate-500'>{a.email}</td>
                                <td>
                                    <button onClick={() => setModal(a)} className='btn-danger text-xs py-1.5 px-3'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            )}

            <ConfirmModal open={Boolean(modal)} title='Remove Assistant' message={`Remove ${modal?.name} from your clinic?`} confirmLabel='Remove' danger onConfirm={handleRemove} onCancel={() => setModal(null)} loading={processing} />
        </div>
    )
}

export default Assistants
