import { useState } from 'react'

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import PageHeader from '../../components/ui/PageHeader'

import { ArrowLeft, AlertTriangle, Save } from 'lucide-react'



const AddMedicalRecord = () => {

    const { appointmentId } = useParams()

    const location = useLocation()

    const navigate = useNavigate()

    const { backendUrl, token } = useAuth()

    const appointment = location.state?.appointment



    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({ symptoms: '', diagnosis: '', notes: '' })



    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!appointment) {

            toast.error('Appointment data missing. Go back and try again.')

            return

        }



        setSaving(true)

        try {

            const { data } = await doctorApi.addMedicalHistory(backendUrl, token, {

                patientId: appointment.patientId,

                appointmentId,

                symptoms: form.symptoms,

                diagnosis: form.diagnosis,

                notes: form.notes,

            })



            if (data.success) {

                toast.success('Medical record saved')

                navigate(`/doctor/appointments/${appointmentId}/prescription`, {

                    state: { appointment, medicalHistoryId: data.record.id },

                })

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setSaving(false)

        }

    }



    return (

        <div className='animate-fade-in'>

            <Link to={`/doctor/appointments/${appointmentId}`} className='btn-ghost -ml-2 mb-4 inline-flex'>

                <ArrowLeft size={16} /> Back

            </Link>



            <PageHeader

                title='Add Medical Record'

                subtitle={appointment ? `${appointment.patientName} · ${appointment.date} at ${appointment.time}` : undefined}

            />



            <form onSubmit={handleSubmit} className='card p-6 max-w-lg flex flex-col gap-5'>

                <div>

                    <label className='text-sm font-medium text-slate-700'>Symptoms</label>

                    <input

                        value={form.symptoms}

                        onChange={(e) => setForm({ ...form, symptoms: e.target.value })}

                        className='input-field mt-1.5'

                        required

                    />

                </div>

                <div>

                    <label className='text-sm font-medium text-slate-700'>Diagnosis</label>

                    <input

                        value={form.diagnosis}

                        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}

                        className='input-field mt-1.5'

                        required

                    />

                </div>

                <div>

                    <label className='text-sm font-medium text-slate-700'>Notes</label>

                    <textarea

                        value={form.notes}

                        onChange={(e) => setForm({ ...form, notes: e.target.value })}

                        rows={4}

                        className='input-field mt-1.5 min-h-[120px] resize-y'

                    />

                </div>



                <div className='flex items-start gap-3 p-3 rounded-xl bg-amber-50 ring-1 ring-amber-600/20'>

                    <AlertTriangle size={16} className='text-amber-600 shrink-0 mt-0.5' />

                    <p className='text-xs text-amber-700'>

                        Medical history records cannot be deleted once saved.

                    </p>

                </div>



                <button type='submit' disabled={saving} className='btn-primary disabled:opacity-60'>

                    <Save size={16} />

                    {saving ? 'Saving...' : 'Save Medical Record'}

                </button>

            </form>

        </div>

    )

}



export default AddMedicalRecord

