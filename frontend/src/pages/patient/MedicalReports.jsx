import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { patientApi } from '../../utils/patientApi'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { LoadingPage } from '../../components/Spinner'
import { FileText, Upload, ExternalLink } from 'lucide-react'
import { toast } from 'react-toastify'

const MedicalReports = () => {
    const { backendUrl, token } = useAuth()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')
    const [file, setFile] = useState(null)

    const load = async () => {
        try {
            const { data } = await patientApi.getReports(backendUrl, token)
            if (data.success) setReports(data.reports)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load reports')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [backendUrl, token])

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return toast.error('Select a file')
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('notes', notes)
            const { data } = await patientApi.uploadReport(backendUrl, token, formData)
            if (data.success) {
                toast.success(data.message)
                setTitle(''); setNotes(''); setFile(null)
                e.target.reset()
                load()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className='animate-fade-in'>
            <PageHeader title='Medical Reports' subtitle='Upload lab reports, X-rays, and medical documents' />

            <form onSubmit={handleUpload} className='card p-6 mb-6 space-y-4'>
                <h3 className='font-semibold text-slate-900 flex items-center gap-2'><Upload size={18} /> Upload New Report</h3>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className='input-field' placeholder='Report title (e.g. Blood Test)' required />
                <input type='file' accept='.jpg,.jpeg,.png,.pdf' onChange={(e) => setFile(e.target.files[0])} className='input-field' required />
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className='input-field min-h-[80px]' placeholder='Optional notes' />
                <p className='text-xs text-slate-400'>JPG, PNG or PDF — max 5MB</p>
                <button type='submit' disabled={uploading} className='btn-primary'>
                    {uploading ? 'Uploading...' : 'Upload Report'}
                </button>
            </form>

            {loading ? <LoadingPage /> : reports.length === 0 ? (
                <EmptyState icon={FileText} title='No reports uploaded' description='Upload your medical reports to share with doctors.' />
            ) : (
                <div className='grid sm:grid-cols-2 gap-4'>
                    {reports.map((r) => (
                        <div key={r.id} className='card p-5'>
                            <div className='flex items-start justify-between'>
                                <div>
                                    <p className='font-semibold text-slate-900'>{r.title}</p>
                                    <p className='text-xs text-slate-400 mt-1'>{new Date(r.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge variant='neutral'>{r.fileType}</Badge>
                            </div>
                            {r.fileType === 'image' && (
                                <img
                                    src={r.fileUrl}
                                    alt={r.title}
                                    className='mt-4 w-full max-h-48 object-cover rounded-xl border border-slate-100'
                                />
                            )}
                            {r.notes && <p className='text-sm text-slate-500 mt-2'>{r.notes}</p>}
                            <a href={r.fileUrl} target='_blank' rel='noreferrer' className='btn-secondary mt-4 text-xs inline-flex'>
                                <ExternalLink size={14} /> View Report
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MedicalReports
