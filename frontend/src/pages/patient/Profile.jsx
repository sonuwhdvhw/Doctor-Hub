import { useContext } from 'react'

import { User, Mail, Shield, Phone } from 'lucide-react'

import { AppContext } from '../../context/AppContext'

import { useAuth } from '../../context/AuthContext'

import PageHeader from '../../components/ui/PageHeader'

import Badge from '../../components/ui/Badge'



const PatientProfile = () => {

    const { user } = useAuth()

    const { userData } = useContext(AppContext)



    const profile = userData || user



    const fields = [

        { label: 'Name', value: profile?.name, icon: User },

        { label: 'Email', value: profile?.email, icon: Mail },

        { label: 'Role', value: user?.role || 'patient', icon: Shield, capitalize: true },

        ...(profile?.phone ? [{ label: 'Phone', value: profile.phone, icon: Phone }] : []),

    ]



    return (

        <div className='animate-fade-in'>

            <PageHeader

                title='Profile'

                subtitle='Your account information'

            />



            <div className='card p-6 sm:p-8 max-w-lg'>

                <div className='flex items-center gap-4 mb-8 pb-6 border-b border-slate-100'>

                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-2xl font-bold'>

                        {profile?.name?.charAt(0)?.toUpperCase() || 'P'}

                    </div>

                    <div>

                        <h2 className='text-xl font-bold text-slate-900'>{profile?.name || 'Patient'}</h2>

                        <div className='mt-1 capitalize'>
                            <Badge variant='brand'>{user?.role || 'patient'}</Badge>
                        </div>

                    </div>

                </div>



                <div className='space-y-5'>

                    {fields.map((field) => (

                        <div key={field.label}>

                            <label className='text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-1.5'>

                                <field.icon size={14} />

                                {field.label}

                            </label>

                            <input

                                type='text'

                                readOnly

                                value={field.capitalize ? (field.value || '—').toString() : (field.value || '—')}

                                className={`input-field bg-slate-50 cursor-default${field.capitalize ? ' capitalize' : ''}`}

                            />

                        </div>

                    ))}

                </div>

            </div>

        </div>

    )

}



export default PatientProfile

