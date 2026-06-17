const ConfirmModal = ({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmClass = 'btn-primary',
    onConfirm,
    onCancel,
    loading = false,
    children,
    danger = false,
}) => {
    if (!open) return null

    const btnClass = danger ? 'btn-danger' : confirmClass

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in'>
            <div className='card p-6 max-w-md w-full shadow-card-hover animate-slide-up'>
                <h3 className='text-lg font-bold text-slate-900'>{title}</h3>
                <p className='text-sm text-slate-500 mt-2 leading-relaxed'>{message}</p>
                {children}
                <div className='flex gap-3 mt-6 justify-end flex-wrap'>
                    <button onClick={onCancel} disabled={loading} className='btn-secondary'>
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} disabled={loading} className={btnClass}>
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
