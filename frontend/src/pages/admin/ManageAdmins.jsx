import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { superAdminApi } from '../../utils/adminApi'

import { LoadingPage } from '../../components/Spinner'

import ConfirmModal from '../../components/ConfirmModal'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'

import { toast } from 'react-toastify'

import { ShieldCheck } from 'lucide-react'



const ManageAdmins = () => {

    const { backendUrl, token } = useAuth()

    const [admins, setAdmins] = useState([])

    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(true)

    const [modal, setModal] = useState(null)

    const [processing, setProcessing] = useState(false)



    const load = async () => {

        try {

            const { data } = await superAdminApi.getAdmins(backendUrl, token)

            if (data.success) setAdmins(data.admins)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load admins')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { load() }, [backendUrl, token])



    const handlePromote = async (e) => {

        e.preventDefault()

        try {

            const { data } = await superAdminApi.promoteAdmin(backendUrl, token, email)

            if (data.success) {

                toast.success(data.message)

                setEmail('')

                load()

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        }

    }



    const handleDemote = async () => {

        if (!modal?.admin) return

        setProcessing(true)

        try {

            const { data } = await superAdminApi.demoteAdmin(backendUrl, token, modal.admin.id)

            if (data.success) {

                toast.success(data.message)

                setModal(null)

                load()

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message)

        } finally {

            setProcessing(false)

        }

    }



    return (

        <div>

            <PageHeader

                title='Manage Admins'

                subtitle='Promote users to admin or demote existing admins'

            />



            <form onSubmit={handlePromote} className='card p-5 flex flex-col sm:flex-row gap-3 mb-8 max-w-lg'>

                <input

                    type='email'

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    placeholder='User email to promote'

                    className='input-field flex-1'

                    required

                />

                <button type='submit' className='btn-primary shrink-0'>Promote</button>

            </form>



            {loading ? (

                <LoadingPage />

            ) : admins.length === 0 ? (

                <EmptyState

                    icon={ShieldCheck}

                    title='No admins yet'

                    description='Promote a user by entering their email above.'

                />

            ) : (

                <div className='card divide-y divide-slate-100 overflow-hidden'>

                    {admins.map((a) => (

                        <div key={a.id} className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/50 transition-colors'>

                            <div>

                                <p className='font-semibold text-slate-800'>{a.name}</p>

                                <p className='text-sm text-slate-500'>{a.email}</p>

                            </div>

                            <button

                                onClick={() => setModal({ admin: a })}

                                className='btn-danger !px-3 !py-1.5 text-xs self-start sm:self-auto'

                            >

                                Demote

                            </button>

                        </div>

                    ))}

                </div>

            )}



            <ConfirmModal

                open={Boolean(modal)}

                title='Demote Admin'

                message={`Demote "${modal?.admin?.name}" to patient role?`}

                confirmLabel='Demote'

                danger

                onConfirm={handleDemote}

                onCancel={() => setModal(null)}

                loading={processing}

            />

        </div>

    )

}



export default ManageAdmins

