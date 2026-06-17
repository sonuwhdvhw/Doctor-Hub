import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'

import { Building2, Clock, MapPin, Plus, X } from 'lucide-react'



const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']



const DoctorClinics = () => {

    const { backendUrl, token } = useAuth()

    const [clinics, setClinics] = useState([])

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [showForm, setShowForm] = useState(false)



    const [form, setForm] = useState({

        clinicName: '',

        address: '',

        city: '',

        availableDays: [],

        startTime: '09:00',

        endTime: '17:00',

    })



    const loadClinics = async () => {

        try {

            const { data } = await doctorApi.getClinics(backendUrl, token)

            if (data.success) setClinics(data.clinics)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load clinics')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { loadClinics() }, [backendUrl, token])



    const toggleDay = (day) => {

        setForm((prev) => ({

            ...prev,

            availableDays: prev.availableDays.includes(day)

                ? prev.availableDays.filter((d) => d !== day)

                : [...prev.availableDays, day],

        }))

    }



    const handleSubmit = async (e) => {

        e.preventDefault()

        setSaving(true)

        try {

            const { data } = await doctorApi.addClinic(backendUrl, token, form)

            if (data.success) {

                toast.success('Clinic added')

                setShowForm(false)

                setForm({ clinicName: '', address: '', city: '', availableDays: [], startTime: '09:00', endTime: '17:00' })

                loadClinics()

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setSaving(false)

        }

    }



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Clinics'

                subtitle='Manage your clinic locations'

                action={

                    <button

                        onClick={() => setShowForm(!showForm)}

                        className={showForm ? 'btn-secondary' : 'btn-primary'}

                    >

                        {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Clinic</>}

                    </button>

                }

            />



            {showForm && (

                <form onSubmit={handleSubmit} className='card p-6 mb-6 flex flex-col gap-4 max-w-xl'>

                    <input

                        placeholder='Clinic Name'

                        value={form.clinicName}

                        onChange={(e) => setForm({ ...form, clinicName: e.target.value })}

                        className='input-field'

                        required

                    />

                    <input

                        placeholder='Address'

                        value={form.address}

                        onChange={(e) => setForm({ ...form, address: e.target.value })}

                        className='input-field'

                        required

                    />

                    <input

                        placeholder='City'

                        value={form.city}

                        onChange={(e) => setForm({ ...form, city: e.target.value })}

                        className='input-field'

                        required

                    />

                    <div>

                        <p className='text-sm font-medium text-slate-700 mb-2'>Available Days</p>

                        <div className='flex flex-wrap gap-2'>

                            {DAYS.map((day) => (

                                <button

                                    key={day}

                                    type='button'

                                    onClick={() => toggleDay(day)}

                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${

                                        form.availableDays.includes(day)

                                            ? 'bg-brand-600 text-white border-brand-600'

                                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'

                                    }`}

                                >

                                    {day}

                                </button>

                            ))}

                        </div>

                    </div>

                    <div className='grid grid-cols-2 gap-4'>

                        <div>

                            <label className='text-sm font-medium text-slate-700'>Start Time</label>

                            <input

                                type='time'

                                value={form.startTime}

                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}

                                className='input-field mt-1.5'

                            />

                        </div>

                        <div>

                            <label className='text-sm font-medium text-slate-700'>End Time</label>

                            <input

                                type='time'

                                value={form.endTime}

                                onChange={(e) => setForm({ ...form, endTime: e.target.value })}

                                className='input-field mt-1.5'

                            />

                        </div>

                    </div>

                    <button type='submit' disabled={saving} className='btn-primary disabled:opacity-60'>

                        {saving ? 'Saving...' : 'Save Clinic'}

                    </button>

                </form>

            )}



            {loading ? (

                <LoadingPage />

            ) : clinics.length === 0 ? (

                <EmptyState

                    icon={Building2}

                    title='No clinics yet'

                    description='Add your first clinic location to start accepting appointments.'

                    action={

                        !showForm && (

                            <button onClick={() => setShowForm(true)} className='btn-primary'>

                                <Plus size={16} /> Add Clinic

                            </button>

                        )

                    }

                />

            ) : (

                <div className='grid gap-4 sm:grid-cols-2'>

                    {clinics.map((clinic) => (

                        <div key={clinic.id} className='card p-5'>

                            <div className='flex items-start gap-3'>

                                <div className='p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0'>

                                    <Building2 size={18} />

                                </div>

                                <div className='min-w-0'>

                                    <h3 className='font-semibold text-slate-900'>{clinic.clinicName}</h3>

                                    <p className='text-sm text-slate-500 mt-1 flex items-start gap-1.5'>

                                        <MapPin size={14} className='shrink-0 mt-0.5' />

                                        {clinic.address}, {clinic.city}

                                    </p>

                                    <p className='text-sm text-slate-500 mt-1 flex items-center gap-1.5'>

                                        <Clock size={14} className='shrink-0' />

                                        {clinic.startTime} – {clinic.endTime}

                                    </p>

                                </div>

                            </div>

                            <div className='flex flex-wrap gap-1.5 mt-4'>

                                {(clinic.availableDays || []).map((d) => (

                                    <Badge key={d} variant='neutral'>{d}</Badge>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default DoctorClinics

