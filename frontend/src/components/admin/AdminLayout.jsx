import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => (
    <div className='min-h-[80vh] py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
            <AdminSidebar />
            <main className='flex-1 min-w-0'>
                <Outlet />
            </main>
        </div>
    </div>
)

export default AdminLayout
