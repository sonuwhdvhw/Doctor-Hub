import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../utils/adminApi'
import { LoadingPage } from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { toast } from 'react-toastify'
import { Stethoscope, Plus, Pencil, Trash2 } from 'lucide-react'

const emptyForm = {
    name: '',
    email: '',
    password: '',
    specialization: '',
    treatmentType: '',
    experience: '',
    fee: '',
    bio: '',
    isVerified: true,
}

const AdminDoctors = () => {
    const { backendUrl, token } = useAuth()
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [processing, setProcessing] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const load = async () => {
        try {
            const { data } = await adminApi.getDoctors(backendUrl, token)
            if (data.success) setDoctors(data.doctors)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load doctors')
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

    const openEdit = (doctor) => {
        setEditingId(doctor.id)
        setForm({
            name: doctor.name || '',
            email: doctor.email || '',
            password: '',
            specialization: doctor.specialization || '',
            treatmentType: doctor.treatmentType || '',
            experience: doctor.experience ?? '',
            fee: doctor.fee ?? '',
            bio: doctor.bio || '',
            isVerified: doctor.isVerified ?? false,
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
                specialization: form.specialization || undefined,
                treatmentType: form.treatmentType || undefined,
                experience: form.experience !== '' ? Number(form.experience) : undefined,
                fee: form.fee !== '' ? Number(form.fee) : undefined,
                bio: form.bio || undefined,
                isVerified: form.isVerified,
            }
            if (form.password) payload.password = form.password

            const { data } = editingId
                ? await adminApi.updateDoctor(backendUrl, token, editingId, payload)
                : await adminApi.createDoctor(backendUrl, token, { ...payload, password: form.password })

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

    const handleConfirm = async () => {
        if (!modal?.doctor) return
        setProcessing(true)
        try {
            let data
            if (modal.action === 'delete') {
                ;({ data } = await adminApi.deleteDoctor(backendUrl, token, modal.doctor.id))
            } else {
                const api = modal.action === 'verify' ? adminApi.verifyDoctor : adminApi.unverifyDoctor
                ;({ data } = await api(backendUrl, token, modal.doctor.id))
            }
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
                title='Doctors'
                subtitle='Add, edit, verify, or remove doctor accounts'
                action={
                    <button onClick={openCreate} className='btn-primary'>
                        <Plus size={16} /> Add Doctor
                    </button>
                }
            />

            {showForm && (
                <form onSubmit={handleSubmit} className='card p-6 mb-8 space-y-4'>
                    <h3 className='font-bold text-slate-900'>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h3>
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <input className='input-field' placeholder='Full name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <input className='input-field' type='email' placeholder='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        <input className='input-field' type='password' placeholder={editingId ? 'New password (optional)' : 'Password (min 8 chars)'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} minLength={editingId ? undefined : 8} />
                        <input className='input-field' placeholder='Specialization' value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                        <select className='input-field' value={form.treatmentType} onChange={(e) => setForm({ ...form, treatmentType: e.target.value })}>
                            <option value=''>Treatment type</option>
                            <option value='allopathic'>Allopathic</option>
                            <option value='homeopathic'>Homeopathic</option>
                            <option value='herbal'>Herbal</option>
                        </select>
                        <input className='input-field' type='number' min='0' placeholder='Experience (years)' value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                        <input className='input-field' type='number' min='0' step='0.01' placeholder='Consultation fee' value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
                        <label className='flex items-center gap-2 text-sm text-slate-700'>
                            <input type='checkbox' checked={form.isVerified} onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} />
                            Verified doctor
                        </label>
                    </div>
                    <textarea className='input-field' rows={3} placeholder='Bio' value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    <div className='flex gap-3'>
                        <button type='submit' disabled={processing} className='btn-primary'>
                            {processing ? 'Saving...' : editingId ? 'Update Doctor' : 'Create Doctor'}
                        </button>
                        <button type='button' onClick={closeForm} className='btn-secondary'>Cancel</button>
                    </div>
                </form>
            )}

            {loading ? (
                <LoadingPage />
            ) : doctors.length === 0 ? (
                <EmptyState
                    icon={Stethoscope}
                    title='No doctors found'
                    description='Add a doctor account using the button above.'
                />
            ) : (
                <DataTable>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Type</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((d) => (
                            <tr key={d.id}>
                                <td>
                                    <p className='font-medium text-slate-800'>{d.name || '—'}</p>
                                    <p className='text-xs text-slate-400'>{d.email}</p>
                                </td>
                                <td className='text-slate-600'>{d.specialization || '—'}</td>
                                <td className='capitalize text-slate-600'>{d.treatmentType || '—'}</td>
                                <td className='text-slate-600'>${d.fee}</td>
                                <td>
                                    <Badge variant={d.isVerified ? 'success' : 'neutral'}>
                                        {d.isVerified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </td>
                                <td>
                                    <div className='flex flex-wrap gap-2'>
                                        <button onClick={() => openEdit(d)} className='btn-secondary !px-2.5 !py-1.5 text-xs'>
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => setModal({ doctor: d, action: d.isVerified ? 'unverify' : 'verify' })}
                                            className={d.isVerified ? 'btn-danger !px-3 !py-1.5 text-xs' : 'btn-primary !px-3 !py-1.5 text-xs'}
                                        >
                                            {d.isVerified ? 'Unverify' : 'Verify'}
                                        </button>
                                        <button onClick={() => setModal({ doctor: d, action: 'delete' })} className='btn-danger !px-2.5 !py-1.5 text-xs'>
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
                title={
                    modal?.action === 'delete'
                        ? 'Delete Doctor'
                        : modal?.action === 'verify'
                            ? 'Verify Doctor'
                            : 'Unverify Doctor'
                }
                message={
                    modal?.action === 'delete'
                        ? `Delete Dr. ${modal?.doctor?.name}? This cannot be undone.`
                        : modal?.action === 'verify'
                            ? `Verify Dr. ${modal?.doctor?.name}? They will appear in patient search.`
                            : `Unverify Dr. ${modal?.doctor?.name}? They will be hidden from patient search.`
                }
                confirmLabel={modal?.action === 'delete' ? 'Delete' : modal?.action === 'verify' ? 'Verify' : 'Unverify'}
                danger={modal?.action === 'delete' || modal?.action === 'unverify'}
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
                loading={processing}
            />
        </div>
    )
}

export default AdminDoctors
