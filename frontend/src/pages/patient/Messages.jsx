import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { patientApi } from '../../utils/patientApi'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import { LoadingPage } from '../../components/Spinner'
import { MessageCircle, Send } from 'lucide-react'
import { toast } from 'react-toastify'

const PatientMessages = () => {
    const { backendUrl, token, user } = useAuth()
    const [contacts, setContacts] = useState([])
    const [selected, setSelected] = useState(null)
    const [messages, setMessages] = useState([])
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        patientApi.getContacts(backendUrl, token).then(({ data }) => {
            if (data.success) setContacts(data.contacts)
        }).catch(() => toast.error('Failed to load contacts')).finally(() => setLoading(false))
    }, [backendUrl, token])

    const loadMessages = async (contact) => {
        setSelected(contact)
        try {
            const { data } = await patientApi.getMessages(backendUrl, token, contact.userId)
            if (data.success) setMessages(data.messages)
        } catch {
            toast.error('Failed to load messages')
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const send = async (e) => {
        e.preventDefault()
        if (!content.trim() || !selected) return
        setSending(true)
        try {
            const { data } = await patientApi.sendMessage(backendUrl, token, { receiverId: selected.userId, content })
            if (data.success) {
                setMessages((prev) => [...prev, data.message])
                setContent('')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send')
        } finally {
            setSending(false)
        }
    }

    if (loading) return <LoadingPage />

    return (
        <div className='animate-fade-in'>
            <PageHeader title='Messages' subtitle='Chat with your doctors' />

            {contacts.length === 0 ? (
                <EmptyState icon={MessageCircle} title='No doctors to message' description='Book and confirm an appointment to message your doctor.' />
            ) : (
                <div className='card overflow-hidden flex flex-col lg:flex-row min-h-[500px]'>
                    <div className='lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-100 p-3 space-y-1'>
                        {contacts.map((c) => (
                            <button
                                key={c.userId}
                                onClick={() => loadMessages(c)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                    selected?.userId === c.userId ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                            >
                                <p className='font-medium'>Dr. {c.name}</p>
                                <p className='text-xs text-slate-400'>{c.specialization}</p>
                            </button>
                        ))}
                    </div>

                    <div className='flex-1 flex flex-col'>
                        {selected ? (
                            <>
                                <div className='px-4 py-3 border-b border-slate-100 font-semibold text-slate-800'>
                                    Dr. {selected.name}
                                </div>
                                <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                                    {messages.map((m) => (
                                        <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                                m.isMine ? 'bg-brand-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                            }`}>
                                                {m.content}
                                                <p className={`text-[10px] mt-1 ${m.isMine ? 'text-brand-200' : 'text-slate-400'}`}>
                                                    {new Date(m.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={bottomRef} />
                                </div>
                                <form onSubmit={send} className='p-4 border-t border-slate-100 flex gap-2'>
                                    <input value={content} onChange={(e) => setContent(e.target.value)} className='input-field flex-1' placeholder='Type a message...' />
                                    <button type='submit' disabled={sending} className='btn-primary px-4'><Send size={16} /></button>
                                </form>
                            </>
                        ) : (
                            <div className='flex-1 flex items-center justify-center text-slate-400 text-sm'>Select a doctor to start chatting</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientMessages
