import { useState } from 'react'

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import PageHeader from '../../components/ui/PageHeader'

import { ArrowLeft, AlertTriangle, Plus, Trash2, Send } from 'lucide-react'



const emptyMedicine = { name: '', dosage: '', frequency: '', duration: '' }



const AddPrescription = () => {

    const { appointmentId } = useParams()

    const location = useLocation()

    const navigate = useNavigate()

    const { backendUrl, token } = useAuth()

    const appointment = location.state?.appointment

    const medicalHistoryId = location.state?.medicalHistoryId



    const [saving, setSaving] = useState(false)

    const [medicines, setMedicines] = useState([{ ...emptyMedicine }])

    const [instructions, setInstructions] = useState('')



    const updateMedicine = (index, field, value) => {

        setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))

    }



    const addMedicine = () => setMedicines((prev) => [...prev, { ...emptyMedicine }])



    const removeMedicine = (index) => {

        if (medicines.length > 1) setMedicines((prev) => prev.filter((_, i) => i !== index))

    }



    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!appointment || !medicalHistoryId) {

            toast.error('Missing appointment or medical record. Save medical record first.')

            return

        }



        setSaving(true)

        try {

            const { data } = await doctorApi.addPrescription(backendUrl, token, {

                patientId: appointment.patientId,

                appointmentId,

                medicalHistoryId,

                medicines,

                instructions,

            })



            if (data.success) {

                toast.success(data.message)

                navigate(`/doctor/patients/${appointment.patientId}/history`)

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

                title='Add Prescription'

                subtitle={appointment ? `${appointment.patientName} · ${appointment.date}` : undefined}

            />



            <form onSubmit={handleSubmit} className='card p-6 max-w-xl flex flex-col gap-5'>

                <div className='flex items-start gap-3 p-4 rounded-xl bg-red-50 ring-1 ring-red-600/20'>

                    <AlertTriangle size={18} className='text-red-600 shrink-0 mt-0.5' />

                    <p className='text-sm font-medium text-red-700'>

                        Prescriptions cannot be edited after submission.

                    </p>

                </div>



                <div className='flex flex-col gap-4'>

                    {medicines.map((med, index) => (

                        <div key={index} className='card p-4 bg-slate-50/50'>

                            <div className='flex items-center justify-between mb-3'>

                                <p className='text-sm font-semibold text-slate-800'>Medicine {index + 1}</p>

                                {medicines.length > 1 && (

                                    <button

                                        type='button'

                                        onClick={() => removeMedicine(index)}

                                        className='btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 text-xs'

                                    >

                                        <Trash2 size={14} /> Remove

                                    </button>

                                )}

                            </div>

                            <div className='grid sm:grid-cols-2 gap-3'>

                                <input

                                    placeholder='Name'

                                    value={med.name}

                                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}

                                    className='input-field'

                                    required

                                />

                                <input

                                    placeholder='Dosage (e.g. 500mg)'

                                    value={med.dosage}

                                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}

                                    className='input-field'

                                    required

                                />

                                <input

                                    placeholder='Frequency (e.g. twice daily)'

                                    value={med.frequency}

                                    onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}

                                    className='input-field'

                                    required

                                />

                                <input

                                    placeholder='Duration (e.g. 7 days)'

                                    value={med.duration}

                                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}

                                    className='input-field'

                                    required

                                />

                            </div>

                        </div>

                    ))}

                </div>



                <button type='button' onClick={addMedicine} className='btn-secondary w-full sm:w-auto'>

                    <Plus size={16} /> Add Medicine

                </button>



                <div>

                    <label className='text-sm font-medium text-slate-700'>General Instructions</label>

                    <textarea

                        value={instructions}

                        onChange={(e) => setInstructions(e.target.value)}

                        rows={3}

                        className='input-field mt-1.5 min-h-[80px] resize-y'

                        placeholder='Take after meals, avoid alcohol...'

                    />

                </div>



                <button type='submit' disabled={saving} className='btn-primary disabled:opacity-60'>

                    <Send size={16} />

                    {saving ? 'Submitting...' : 'Submit Prescription'}

                </button>

            </form>

        </div>

    )

}



export default AddPrescription

