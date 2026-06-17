import { useEffect, useState } from 'react'

import { Link, useSearchParams } from 'react-router-dom'

import { Search, Star, Stethoscope, Briefcase, DollarSign, UserSearch } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { patientApi } from '../../utils/patientApi'

import { toast } from 'react-toastify'

import { LoadingPage } from '../../components/Spinner'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'

import EmptyState from '../../components/ui/EmptyState'



const TREATMENT_TYPES = [

    { value: '', label: 'All' },

    { value: 'allopathic', label: 'Allopathic' },

    { value: 'homeopathic', label: 'Homeopathic' },

    { value: 'herbal', label: 'Herbal' },

]



const FindDoctor = () => {
    const { backendUrl, token } = useAuth()
    const [searchParams] = useSearchParams()
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [treatmentType, setTreatmentType] = useState(searchParams.get('type') || '')



    const loadDoctors = async () => {

        setLoading(true)

        try {

            const params = {}

            if (search) params.search = search

            if (treatmentType) params.type = treatmentType



            const { data } = await patientApi.listDoctors(backendUrl, token, params)

            if (data.success) setDoctors(data.doctors)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load doctors')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { loadDoctors() }, [backendUrl, token])



    const handleSearch = (e) => {

        e.preventDefault()

        loadDoctors()

    }



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Find Doctor'

                subtitle='Search verified doctors by name or specialization'

            />



            <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3 mb-4'>

                <div className='relative flex-1'>

                    <Search size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />

                    <input

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                        placeholder='Search by name, disease or specialization...'

                        className='input-field pl-10'

                    />

                </div>

                <button type='submit' className='btn-primary sm:shrink-0'>

                    <Search size={16} />

                    Search

                </button>

            </form>



            <div className='flex gap-2 mb-6 flex-wrap'>

                {TREATMENT_TYPES.map((t) => (

                    <button

                        key={t.value}

                        type='button'

                        onClick={() => setTreatmentType(t.value)}

                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${

                            treatmentType === t.value

                                ? 'bg-brand-600 text-white shadow-sm'

                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                        }`}

                    >

                        {t.label}

                    </button>

                ))}

            </div>



            {loading ? (

                <LoadingPage />

            ) : doctors.length === 0 ? (

                <EmptyState

                    icon={UserSearch}

                    title='No doctors found'

                    description='No verified doctors match your search. Try adjusting your filters.'

                />

            ) : (

                <div className='grid sm:grid-cols-2 gap-4'>

                    {doctors.map((doc) => (

                        <div key={doc.id} className='card-hover p-5'>

                            <div className='flex items-start justify-between'>

                                <div>

                                    <h3 className='font-semibold text-slate-900'>Dr. {doc.name}</h3>

                                    <p className='text-sm text-brand-600 mt-0.5 font-medium'>{doc.specialization}</p>

                                </div>

                                <Badge variant='warning'>

                                    <Star size={12} className='mr-1' />

                                    {doc.rating}

                                </Badge>

                            </div>

                            <div className='mt-3 flex flex-wrap gap-3 text-sm text-slate-500'>

                                <span className='inline-flex items-center gap-1 capitalize'>

                                    <Stethoscope size={14} />

                                    {doc.treatmentType}

                                </span>

                                <span className='inline-flex items-center gap-1'>

                                    <Briefcase size={14} />

                                    {doc.experience} yrs exp

                                </span>

                                <span className='inline-flex items-center gap-1 font-medium text-slate-700'>

                                    <DollarSign size={14} />

                                    {doc.fee}

                                </span>

                            </div>

                            {doc.bio && (

                                <p className='text-xs text-slate-400 mt-2 line-clamp-2'>{doc.bio}</p>

                            )}

                            <Link

                                to={`/patient/doctors/${doc.id}`}

                                className='btn-primary mt-4 text-sm'

                            >

                                View Profile & Book

                            </Link>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}



export default FindDoctor

