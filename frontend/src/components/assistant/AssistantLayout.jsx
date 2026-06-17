import { Outlet } from 'react-router-dom'
import AssistantSidebar from './AssistantSidebar'

const AssistantLayout = () => (
    <div className='min-h-[80vh] py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
            <AssistantSidebar />
            <main className='flex-1 min-w-0'>
                <Outlet />
            </main>
        </div>
    </div>
)

export default AssistantLayout
