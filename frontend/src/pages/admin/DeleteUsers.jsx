import { useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'

import { superAdminApi } from '../../utils/adminApi'

import { LoadingPage } from '../../components/Spinner'

import ConfirmModal from '../../components/ConfirmModal'

import PageHeader from '../../components/ui/PageHeader'

import DataTable from '../../components/ui/DataTable'

import Badge from '../../components/ui/Badge'

import { toast } from 'react-toastify'



const roleVariant = {

    patient: 'info',

    doctor: 'success',

    assistant: 'brand',

    admin: 'warning',

}



const DeleteUsers = () => {

    const { backendUrl, token, user } = useAuth()

    const [users, setUsers] = useState([])

    const [loading, setLoading] = useState(true)

    const [modal, setModal] = useState(null)

    const [processing, setProcessing] = useState(false)



    const load = async () => {

        try {

            const { data } = await superAdminApi.getUsers(backendUrl, token)

            if (data.success) setUsers(data.users)

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to load users')

        } finally {

            setLoading(false)

        }

    }



    useEffect(() => { load() }, [backendUrl, token])



    const handleDelete = async () => {

        if (!modal?.user) return

        setProcessing(true)

        try {

            const { data } = await superAdminApi.deleteUser(backendUrl, token, modal.user.id)

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

                title='Delete Users'

                subtitle='Remove users from the system'

            />

            <Badge variant='warning'>Medical history records are never deleted</Badge>



            <div className='mt-6'>

                {loading ? (

                    <LoadingPage />

                ) : (

                    <DataTable minWidth='560px'>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Role</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map((u) => (

                                <tr key={u.id}>

                                    <td className='font-medium text-slate-800'>{u.name}</td>

                                    <td className='text-slate-500'>{u.email}</td>

                                    <td>

                                        <Badge variant={roleVariant[u.role] || 'neutral'}>

                                            {u.role}

                                        </Badge>

                                    </td>

                                    <td>

                                        {u.id !== user?.id && (

                                            <button

                                                onClick={() => setModal({ user: u })}

                                                className='btn-danger !px-3 !py-1.5 text-xs'

                                            >

                                                Delete

                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </DataTable>

                )}

            </div>



            <ConfirmModal

                open={Boolean(modal)}

                title='Delete User'

                message={`Delete "${modal?.user?.name}"? Medical history will be preserved.`}

                confirmLabel='Delete User'

                danger

                onConfirm={handleDelete}

                onCancel={() => setModal(null)}

                loading={processing}

            />

        </div>

    )

}



export default DeleteUsers

