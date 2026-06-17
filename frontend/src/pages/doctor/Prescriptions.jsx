import { Link } from 'react-router-dom'

import PageHeader from '../../components/ui/PageHeader'

import EmptyState from '../../components/ui/EmptyState'

import { Pill, Calendar, History } from 'lucide-react'



const DoctorPrescriptions = () => (

    <div className='animate-fade-in'>

        <PageHeader

            title='Prescriptions'

            subtitle='Prescriptions are created from confirmed appointments and cannot be edited after submission.'

        />



        <EmptyState

            icon={Pill}

            title='Add prescriptions via appointments'

            description='Open a confirmed appointment, add a medical record, then create a prescription for the patient.'

            action={

                <div className='flex gap-3 justify-center flex-wrap'>

                    <Link to='/doctor/appointments' className='btn-primary'>

                        <Calendar size={16} /> Go to Appointments

                    </Link>

                    <Link to='/doctor/patients' className='btn-secondary'>

                        <History size={16} /> View Patient History

                    </Link>

                </div>

            }

        />

    </div>

)



export default DoctorPrescriptions

