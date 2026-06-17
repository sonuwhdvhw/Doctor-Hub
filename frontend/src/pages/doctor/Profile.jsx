import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'



const TREATMENT_TYPES = [

    { value: 'allopathic', label: 'Allopathic' },

    { value: 'homeopathic', label: 'Homeopathic' },

    { value: 'herbal', label: 'Herbal' },

]



const DoctorProfile = () => {

    const { backendUrl, token } = useAuth()

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [isNew, setIsNew] = useState(true)



    const [form, setForm] = useState({

        specialization: '',

        treatmentType: 'allopathic',

        experience: '',

        fee: '',

        bio: '',

    })



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await doctorApi.getProfile(backendUrl, token)

                if (data.success && data.doctor?.specialization) {

                    setIsNew(false)

                    setForm({

                        specialization: data.doctor.specialization || '',

                        treatmentType: data.doctor.treatmentType || 'allopathic',

                        experience: data.doctor.experience || '',

                        fee: data.doctor.fee || '',

                        bio: data.doctor.bio || '',

                    })

                }

            } catch {

                // Profile not set up yet

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token])



    const handleChange = (e) => {

        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    }



    const handleSubmit = async (e) => {

        e.preventDefault()

        setSaving(true)

        try {

            const payload = {

                specialization: form.specialization,

                treatmentType: form.treatmentType,

                experience: Number(form.experience) || 0,

                fee: Number(form.fee) || 0,

                bio: form.bio,

            }



            const { data } = isNew

                ? await doctorApi.createProfile(backendUrl, token, payload)

                : await doctorApi.updateProfile(backendUrl, token, payload)



            if (data.success) {

                toast.success(data.message)

                setIsNew(false)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setSaving(false)

        }

    }



    if (loading) return <LoadingPage />



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='My Profile'

                subtitle={isNew ? 'Complete your doctor profile to get started' : 'Update your professional details'}

            />



            <form onSubmit={handleSubmit} className='card p-6 max-w-xl flex flex-col gap-5'>

                <div>

                    <label className='text-sm font-medium text-slate-700'>Specialization</label>

                    <input

                        name='specialization'

                        value={form.specialization}

                        onChange={handleChange}

                        className='input-field mt-1.5'

                        placeholder='e.g. Cardiologist, Dermatologist'

                        required

                    />

                </div>



                <div>

                    <label className='text-sm font-medium text-slate-700'>Treatment Type</label>

                    <select

                        name='treatmentType'

                        value={form.treatmentType}

                        onChange={handleChange}

                        className='input-field mt-1.5'

                    >

                        {TREATMENT_TYPES.map((t) => (

                            <option key={t.value} value={t.value}>{t.label}</option>

                        ))}

                    </select>

                </div>



                <div className='grid grid-cols-2 gap-4'>

                    <div>

                        <label className='text-sm font-medium text-slate-700'>Experience (years)</label>

                        <input

                            name='experience'

                            type='number'

                            min='0'

                            value={form.experience}

                            onChange={handleChange}

                            className='input-field mt-1.5'

                        />

                    </div>

                    <div>

                        <label className='text-sm font-medium text-slate-700'>Consultation Fee ($)</label>

                        <input

                            name='fee'

                            type='number'

                            min='0'

                            step='0.01'

                            value={form.fee}

                            onChange={handleChange}

                            className='input-field mt-1.5'

                        />

                    </div>

                </div>



                <div>

                    <label className='text-sm font-medium text-slate-700'>Bio</label>

                    <textarea

                        name='bio'

                        value={form.bio}

                        onChange={handleChange}

                        rows={4}

                        className='input-field mt-1.5 min-h-[120px] resize-y'

                        placeholder='Tell patients about your experience and approach...'

                    />

                </div>



                <button type='submit' disabled={saving} className='btn-primary w-full sm:w-auto'>

                    {saving ? 'Saving...' : isNew ? 'Create Profile' : 'Update Profile'}

                </button>

            </form>

        </div>

    )

}



export default DoctorProfile

