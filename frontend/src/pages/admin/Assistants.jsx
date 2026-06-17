import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../utils/adminApi'
import { LoadingPage } from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import EmptyState from '../../components/ui/EmptyState'
import { toast } from 'react-toastify'
import { UserPlus, Plus, Pencil, Trash2 } from 'lucide-react'

const emptyForm = {
    name: '',
    email: '',
    password: '',
    doctorId: '',
}

const AdminAssistants = () => {
    const { backendUrl, token } = useAuth()
    const [assistants, setAssistants] = useState([])
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [processing, setProcessing] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const load = async () => {
        try {
            const [assistantsRes, doctorsRes] = await Promise.all([
                adminApi.getAssistants(backendUrl, token),
                adminApi.getDoctors(backendUrl, token),
            ])
            if (assistantsRes.data.success) setAssistants(assistantsRes.data.assistants)
            if (doctorsRes.data.success) setDoctors(doctorsRes.data.doctors)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load assistants')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [backendUrl, token])

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setShowForm(true)
    }

    const openEdit = (assistant) => {
        setEditingId(assistant.id)
        setForm({
            name: assistant.name || '',
            email: assistant.email || '',
            password: '',
            doctorId: assistant.doctorId || '',
        })
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setProcessing(true)
        try {
            const payload = {
                name: form.name,
                email: form.email,
                doctorId: form.doctorId || null,
            }
            if (form.password) payload.password = form.password

            const { data } = editingId
                ? await adminApi.updateAssistant(backendUrl, token, editingId, payload)
                : await adminApi.createAssistant(backendUrl, token, { ...payload, password: form.password })

            if (data.success) {
                toast.success(data.message)
                closeForm()
                load()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setProcessing(false)
        }
    }

    const handleDelete = async () => {
        if (!modal?.assistant) return
        setProcessing(true)
        try {
            const { data } = await adminApi.deleteAssistant(backendUrl, token, modal.assistant.id)
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
        <div>
            <PageHeader
                title='Assistants'
                subtitle='Add, edit, assign, or remove assistant accounts'
                action={
                    <button onClick={openCreate} className='btn-primary'>
                        <Plus size={16} /> Add Assistant
                    </button>
                }
            />

            {showForm && (
                <form onSubmit={handleSubmit} className='card p-6 mb-8 space-y-4'>
                    <h3 className='font-bold text-slate-900'>{editingId ? 'Edit Assistant' : 'Add Assistant'}</h3>
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <input className='input-field' placeholder='Full name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <input className='input-field' type='email' placeholder='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        <input className='input-field' type='password' placeholder={editingId ? 'New password (optional)' : 'Password (min 8 chars)'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} minLength={editingId ? undefined : 8} />
                        <select className='input-field' value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                            <option value=''>Assign to doctor (optional)</option>
                            {doctors.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name || d.email}{d.specialization ? ` — ${d.specialization}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex gap-3'>
                        <button type='submit' disabled={processing} className='btn-primary'>
                            {processing ? 'Saving...' : editingId ? 'Update Assistant' : 'Create Assistant'}
                        </button>
                        <button type='button' onClick={closeForm} className='btn-secondary'>Cancel</button>
                    </div>
                </form>
            )}

            {loading ? (
                <LoadingPage />
            ) : assistants.length === 0 ? (
                <EmptyState
                    icon={UserPlus}
                    title='No assistants found'
                    description='Add an assistant account using the button above.'
                />
            ) : (
                <DataTable>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Assigned Doctor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assistants.map((a) => (
                            <tr key={a.id}>
                                <td>
                                    <p className='font-medium text-slate-800'>{a.name || '—'}</p>
                                    <p className='text-xs text-slate-400'>{a.email}</p>
                                </td>
                                <td className='text-slate-600'>
                                    {a.doctorName ? (
                                        <>
                                            <p>{a.doctorName}</p>
                                            {a.doctorSpecialization && <p className='text-xs text-slate-400'>{a.doctorSpecialization}</p>}
                                        </>
                                    ) : 'Unassigned'}
                                </td>
                                <td>
                                    <div className='flex flex-wrap gap-2'>
                                        <button onClick={() => openEdit(a)} className='btn-secondary !px-2.5 !py-1.5 text-xs'>
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => setModal({ assistant: a })} className='btn-danger !px-2.5 !py-1.5 text-xs'>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            )}

            <ConfirmModal
                open={Boolean(modal)}
                title='Delete Assistant'
                message={`Delete assistant "${modal?.assistant?.name}"? This cannot be undone.`}
                confirmLabel='Delete'
                danger
                onConfirm={handleDelete}
                onCancel={() => setModal(null)}
                loading={processing}
            />
        </div>
    )
}

export default AdminAssistants
