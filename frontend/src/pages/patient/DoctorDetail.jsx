import { useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { ArrowLeft, Star, Stethoscope, Briefcase, DollarSign, MapPin, Clock, CalendarDays } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'



const DoctorDetail = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const { backendUrl, token } = useAuth()

    const [doctor, setDoctor] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await patientApi.getDoctor(backendUrl, token, id)

                if (data.success) setDoctor(data.doctor)

            } catch (error) {

                toast.error(error.response?.data?.message || 'Doctor not found')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token, id])



    if (loading) return <LoadingPage />

    if (!doctor) return (

        <EmptyState

            icon={Stethoscope}

            title='Doctor not found'

            description='The doctor profile you are looking for does not exist.'

            action={<Link to='/patient/find-doctor' className='btn-primary'>Back to Search</Link>}

        />

    )



    return (

        <div className='animate-fade-in'>

            <Link to='/patient/find-doctor' className='btn-ghost mb-6 -ml-2'>

                <ArrowLeft size={16} />

                Back to search

            </Link>



            <div className='card p-6 sm:p-8 mb-8'>

                <div className='flex items-start justify-between flex-wrap gap-6'>

                    <div className='flex gap-4'>

                        <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shrink-0'>

                            {doctor.name?.charAt(0)?.toUpperCase()}

                        </div>

                        <div>

                            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Dr. {doctor.name}</h1>

                            <p className='text-brand-600 font-medium mt-1'>{doctor.specialization}</p>

                            <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500'>

                                <span className='inline-flex items-center gap-1 capitalize'>

                                    <Stethoscope size={14} />

                                    {doctor.treatmentType}

                                </span>

                                <span className='inline-flex items-center gap-1'>

                                    <Briefcase size={14} />

                                    {doctor.experience} years

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className='text-right'>

                        <p className='text-3xl font-bold text-slate-900'>${doctor.fee}</p>

                        <p className='text-xs text-slate-400 mt-0.5'>consultation fee</p>

                        <div className='mt-2'>

                            <Badge variant='warning'>

                                <Star size={12} className='mr-1' />

                                {doctor.rating}

                            </Badge>

                        </div>

                    </div>

                </div>

                {doctor.bio && (

                    <p className='text-sm text-slate-600 mt-6 leading-relaxed border-t border-slate-100 pt-6'>{doctor.bio}</p>

                )}

                <button

                    onClick={() => navigate(`/patient/book/${doctor.id}`)}

                    className='btn-primary mt-6'

                >

                    <CalendarDays size={16} />

                    Book Appointment

                </button>

            </div>



            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Clinics</h2>

            {doctor.clinics?.length === 0 ? (

                <EmptyState

                    icon={MapPin}

                    title='No clinics listed'

                    description='This doctor has not added any clinic locations yet.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 gap-4 mb-8'>

                    {doctor.clinics.map((c) => (

                        <div key={c.id} className='card p-4'>

                            <p className='font-semibold text-slate-900'>{c.clinicName}</p>

                            <p className='text-sm text-slate-500 mt-1 flex items-start gap-1.5'>

                                <MapPin size={14} className='shrink-0 mt-0.5 text-slate-400' />

                                {c.address}, {c.city}

                            </p>

                            <p className='text-xs text-slate-400 mt-2 flex items-center gap-1.5'>

                                <Clock size={12} />

                                {c.startTime} – {c.endTime}

                            </p>

                        </div>

                    ))}

                </div>

            )}



            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Available Schedule</h2>

            {doctor.schedules?.length === 0 ? (

                <EmptyState

                    icon={CalendarDays}

                    title='No available slots'

                    description='This doctor has not set any available time slots yet.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>

                    {doctor.schedules.map((s) => (

                        <div key={s.date} className='card p-4'>

                            <p className='font-semibold text-sm text-slate-900 flex items-center gap-1.5'>

                                <CalendarDays size={14} className='text-brand-600' />

                                {s.date}

                            </p>

                            <div className='flex flex-wrap gap-1.5 mt-3'>

                                {s.timeSlots.map((slot) => (

                                    <Badge key={slot} variant='success'>{slot}</Badge>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default DoctorDetail

