const DataTable = ({ children, minWidth = '640px' }) => (
  <div className='card overflow-hidden'>
    <div className='overflow-x-auto'>
      <table className='table-modern' style={{ minWidth }}>{children}</table>
    </div>
  </div>
)

export default DataTable
