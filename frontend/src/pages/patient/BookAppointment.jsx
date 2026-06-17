import { useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { ArrowLeft, Check, MapPin, CalendarDays, Clock, Upload, CreditCard } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'



const STEPS = ['Select Clinic', 'Select Date & Time', 'Confirm Booking', 'Upload Payment']



const BookAppointment = () => {

    const { doctorId } = useParams()

    const navigate = useNavigate()

    const { backendUrl, token } = useAuth()



    const [step, setStep] = useState(0)

    const [doctor, setDoctor] = useState(null)

    const [loading, setLoading] = useState(true)

    const [submitting, setSubmitting] = useState(false)



    const [clinicId, setClinicId] = useState('')

    const [date, setDate] = useState('')

    const [timeSlot, setTimeSlot] = useState('')

    const [appointment, setAppointment] = useState(null)

    const [screenshot, setScreenshot] = useState(null)

    const [amount, setAmount] = useState('')



    useEffect(() => {

        const load = async () => {

            try {

                const { data } = await patientApi.getDoctor(backendUrl, token, doctorId)

                if (data.success) {

                    setDoctor(data.doctor)

                    setAmount(String(data.doctor.fee || ''))

                }

            } catch (error) {

                toast.error(error.response?.data?.message || 'Failed to load doctor')

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [backendUrl, token, doctorId])



    const selectedClinic = doctor?.clinics?.find((c) => c.id === clinicId)

    const availableDates = doctor?.schedules || []

    const slotsForDate = availableDates.find((s) => s.date === date)?.timeSlots || []



    const handleBook = async () => {

        setSubmitting(true)

        try {

            const { data } = await patientApi.bookAppointment(backendUrl, token, {

                doctorId,

                clinicId,

                date,

                timeSlot,

            })

            if (data.success) {

                setAppointment(data.appointment)

                toast.success('Appointment booked!')

                setStep(3)

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setSubmitting(false)

        }

    }



    const handlePayment = async () => {

        if (!screenshot) {

            toast.error('Please upload payment screenshot')

            return

        }

        setSubmitting(true)

        try {

            const formData = new FormData()

            formData.append('appointmentId', appointment.id)

            formData.append('amount', amount)

            formData.append('screenshot', screenshot)



            const { data } = await patientApi.uploadPayment(backendUrl, token, formData)

            if (data.success) {

                toast.success('Payment uploaded! Awaiting verification.')

                navigate('/patient/appointments')

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setSubmitting(false)

        }

    }



    if (loading) return <LoadingPage />

    if (!doctor) return (

        <EmptyState

            title='Doctor not found'

            description='Unable to load doctor details for booking.'

            action={<Link to='/patient/find-doctor' className='btn-primary'>Back to Search</Link>}

        />

    )



    return (

        <div className='animate-fade-in'>

            <Link to={`/patient/doctors/${doctorId}`} className='btn-ghost mb-6 -ml-2'>

                <ArrowLeft size={16} />

                Back

            </Link>



            <PageHeader

                title='Book Appointment'

                subtitle={`Dr. ${doctor.name} · ${doctor.specialization}`}

            />



            <div className='mb-8'>

                <div className='flex items-center justify-between max-w-2xl'>

                    {STEPS.map((label, i) => (

                        <div key={label} className='flex items-center flex-1 last:flex-none'>

                            <div className='flex flex-col items-center'>

                                <div

                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${

                                        i < step

                                            ? 'bg-emerald-500 text-white'

                                            : i === step

                                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'

                                                : 'bg-slate-100 text-slate-400'

                                    }`}

                                >

                                    {i < step ? <Check size={16} /> : i + 1}

                                </div>

                                <span className={`text-xs mt-2 text-center hidden sm:block max-w-[80px] ${

                                    i === step ? 'text-brand-600 font-semibold' : 'text-slate-400'

                                }`}>

                                    {label}

                                </span>

                            </div>

                            {i < STEPS.length - 1 && (

                                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 rounded ${

                                    i < step ? 'bg-emerald-400' : 'bg-slate-200'

                                }`} />

                            )}

                        </div>

                    ))}

                </div>

            </div>



            <div className='card p-6 max-w-lg'>

                {step === 0 && (

                    <>

                        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>

                            <MapPin size={18} className='text-brand-600' />

                            Select Clinic

                        </h3>

                        {doctor.clinics?.length === 0 ? (

                            <p className='text-slate-400 text-sm'>No clinics available.</p>

                        ) : (

                            <div className='flex flex-col gap-2'>

                                {doctor.clinics.map((c) => (

                                    <button

                                        key={c.id}

                                        type='button'

                                        onClick={() => setClinicId(c.id)}

                                        className={`text-left rounded-xl p-4 border transition-all ${

                                            clinicId === c.id

                                                ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'

                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'

                                        }`}

                                    >

                                        <p className='font-medium text-slate-900'>{c.clinicName}</p>

                                        <p className='text-sm text-slate-500'>{c.address}, {c.city}</p>

                                    </button>

                                ))}

                            </div>

                        )}

                        <button

                            disabled={!clinicId}

                            onClick={() => setStep(1)}

                            className='btn-primary mt-4 disabled:opacity-50'

                        >

                            Next

                        </button>

                    </>

                )}



                {step === 1 && (

                    <>

                        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>

                            <CalendarDays size={18} className='text-brand-600' />

                            Select Date & Time

                        </h3>

                        <div className='grid grid-cols-2 gap-2 mb-4'>

                            {availableDates.map((s) => (

                                <button

                                    key={s.date}

                                    type='button'

                                    onClick={() => { setDate(s.date); setTimeSlot('') }}

                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${

                                        date === s.date

                                            ? 'border-brand-500 bg-brand-50 text-brand-700'

                                            : 'border-slate-200 hover:border-slate-300'

                                    }`}

                                >

                                    {s.date}

                                </button>

                            ))}

                        </div>

                        {date && (

                            <div className='flex flex-wrap gap-2 mb-4'>

                                {slotsForDate.map((slot) => (

                                    <button

                                        key={slot}

                                        type='button'

                                        onClick={() => setTimeSlot(slot)}

                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${

                                            timeSlot === slot

                                                ? 'bg-brand-600 text-white border-brand-600'

                                                : 'border-slate-200 text-slate-600 hover:border-brand-300'

                                        }`}

                                    >

                                        {slot}

                                    </button>

                                ))}

                            </div>

                        )}

                        <div className='flex gap-2'>

                            <button onClick={() => setStep(0)} className='btn-secondary'>Back</button>

                            <button

                                disabled={!date || !timeSlot}

                                onClick={() => setStep(2)}

                                className='btn-primary disabled:opacity-50'

                            >

                                Next

                            </button>

                        </div>

                    </>

                )}



                {step === 2 && (

                    <>

                        <h3 className='font-semibold text-slate-900 mb-4'>Confirm Booking</h3>

                        <div className='bg-slate-50 rounded-xl p-4 text-sm space-y-2.5'>

                            <p><span className='text-slate-500'>Doctor:</span> <span className='font-medium text-slate-800'>Dr. {doctor.name}</span></p>

                            <p><span className='text-slate-500'>Clinic:</span> <span className='font-medium text-slate-800'>{selectedClinic?.clinicName}</span></p>

                            <p><span className='text-slate-500'>Address:</span> {selectedClinic?.address}, {selectedClinic?.city}</p>

                            <p><span className='text-slate-500'>Date:</span> <span className='font-medium text-slate-800'>{date}</span></p>

                            <p><span className='text-slate-500'>Time:</span> <span className='font-medium text-slate-800'>{timeSlot}</span></p>

                            <p><span className='text-slate-500'>Fee:</span> <span className='font-medium text-slate-800'>${doctor.fee}</span></p>

                        </div>

                        <div className='flex gap-2 mt-4'>

                            <button onClick={() => setStep(1)} className='btn-secondary'>Back</button>

                            <button

                                disabled={submitting}

                                onClick={handleBook}

                                className='btn-primary disabled:opacity-50'

                            >

                                {submitting ? 'Booking...' : 'Confirm Booking'}

                            </button>

                        </div>

                    </>

                )}



                {step === 3 && appointment && (

                    <>

                        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>

                            <Upload size={18} className='text-brand-600' />

                            Upload Payment Screenshot

                        </h3>

                        <p className='text-sm text-slate-500 mb-4'>

                            Appointment #{appointment.id.slice(0, 8)} booked. Upload your payment proof.

                        </p>

                        <div className='mb-4'>

                            <label className='text-sm font-medium text-slate-700'>Amount ($)</label>

                            <input

                                type='number'

                                value={amount}

                                onChange={(e) => setAmount(e.target.value)}

                                className='input-field mt-1.5'

                            />

                        </div>

                        <div className='mb-4'>

                            <label className='text-sm font-medium text-slate-700'>Payment Screenshot</label>

                            <input

                                type='file'

                                accept='image/*'

                                onChange={(e) => setScreenshot(e.target.files[0])}

                                className='input-field mt-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700'

                            />

                        </div>

                        <div className='flex gap-2'>

                            <button

                                onClick={() => navigate('/patient/appointments')}

                                className='btn-secondary'

                            >

                                Skip for now

                            </button>

                            <button

                                disabled={submitting || !screenshot}

                                onClick={handlePayment}

                                className='btn-primary disabled:opacity-50'

                            >

                                <CreditCard size={16} />

                                {submitting ? 'Uploading...' : 'Upload Payment'}

                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    )

}



export default BookAppointment

