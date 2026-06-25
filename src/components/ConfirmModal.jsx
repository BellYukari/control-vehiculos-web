function ConfirmModal({
  visible,
  title = "Confirmar acción",
  message = "¿Está seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <button type="button" className="modal-close" onClick={onCancel}>
          <i className="pi pi-times"></i>
        </button>

        <div className="confirm-icon">
          <i className="pi pi-exclamation-triangle"></i>
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="text-btn"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="pi pi-times"></i>
            {cancelText}
          </button>

          <button
            type="button"
            className="text-btn delete-text-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            <i className="pi pi-trash"></i>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;