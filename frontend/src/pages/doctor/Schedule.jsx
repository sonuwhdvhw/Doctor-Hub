import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { doctorApi } from '../../utils/doctorApi'

import { toast } from 'react-toastify'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import { CalendarDays, Save } from 'lucide-react'



const DEFAULT_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']



const getNextDays = (count = 14) => {

    const days = []

    const today = new Date()

    for (let i = 0; i < count; i++) {

        const d = new Date(today)

        d.setDate(today.getDate() + i)

        days.push({

            date: d.toISOString().split('T')[0],

            label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),

        })

    }

    return days

}



const DoctorSchedule = () => {

    const { backendUrl, token } = useAuth()

    const days = getNextDays(14)

    const [selectedDate, setSelectedDate] = useState(days[0]?.date || '')

    const [selectedSlots, setSelectedSlots] = useState([])

    const [schedules, setSchedules] = useState({})

    const [saving, setSaving] = useState(false)



    const loadSchedule = async () => {

        try {

            const from = days[0].date

            const to = days[days.length - 1].date

            const { data } = await doctorApi.getSchedule(backendUrl, token, { from, to })

            if (data.success) {

                const map = {}

                data.schedules.forEach((s) => { map[s.date] = s })

                setSchedules(map)

            }

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load schedule')

        }

    }



    useEffect(() => { loadSchedule() }, [backendUrl, token])



    useEffect(() => {

        const existing = schedules[selectedDate]

        setSelectedSlots(existing?.timeSlots || [])

    }, [selectedDate, schedules])



    const toggleSlot = (slot) => {

        setSelectedSlots((prev) =>

            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()

        )

    }



    const handleSave = async () => {

        if (!selectedDate) return

        setSaving(true)

        try {

            const { data } = await doctorApi.setSchedule(backendUrl, token, {

                date: selectedDate,

                timeSlots: selectedSlots,

                isAvailable: selectedSlots.length > 0,

            })

            if (data.success) {

                toast.success('Schedule saved')

                loadSchedule()

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

                title='Schedule'

                subtitle='Select dates and available time slots'

            />



            <div className='grid lg:grid-cols-2 gap-6'>

                <div className='card p-5'>

                    <div className='flex items-center gap-2 mb-4'>

                        <CalendarDays size={18} className='text-brand-600' />

                        <p className='text-sm font-semibold text-slate-700'>Select Date</p>

                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>

                        {days.map((day) => {

                            const hasSlots = schedules[day.date]?.timeSlots?.length > 0

                            return (

                                <button

                                    key={day.date}

                                    type='button'

                                    onClick={() => setSelectedDate(day.date)}

                                    className={`p-3 rounded-xl border text-sm text-left transition-colors ${

                                        selectedDate === day.date

                                            ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600/20'

                                            : hasSlots

                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300'

                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'

                                    }`}

                                >

                                    {day.label}

                                    {hasSlots && (

                                        <span className='block text-xs text-emerald-600 mt-0.5 font-medium'>

                                            {schedules[day.date].timeSlots.length} slots

                                        </span>

                                    )}

                                </button>

                            )

                        })}

                    </div>

                </div>



                <div className='card p-5'>

                    <p className='text-sm font-semibold text-slate-700 mb-4'>

                        Time Slots for {selectedDate}

                    </p>

                    <div className='flex flex-wrap gap-2 mb-4'>

                        {DEFAULT_SLOTS.map((slot) => (

                            <button

                                key={slot}

                                type='button'

                                onClick={() => toggleSlot(slot)}

                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${

                                    selectedSlots.includes(slot)

                                        ? 'bg-brand-600 text-white border-brand-600'

                                        : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'

                                }`}

                            >

                                {slot}

                            </button>

                        ))}

                    </div>



                    {selectedSlots.length > 0 && (

                        <div className='mb-4 flex flex-wrap gap-1.5'>

                            {selectedSlots.map((slot) => (

                                <Badge key={slot} variant='brand'>{slot}</Badge>

                            ))}

                        </div>

                    )}



                    <button

                        onClick={handleSave}

                        disabled={saving}

                        className='btn-primary disabled:opacity-60'

                    >

                        <Save size={16} />

                        {saving ? 'Saving...' : 'Save Schedule'}

                    </button>

                </div>

            </div>

        </div>

    )

}



export default DoctorSchedule

