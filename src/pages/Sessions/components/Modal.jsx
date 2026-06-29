export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const modalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };
  const modalContent = {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  };
  const panelTitle = {
    margin: '0 0 6px',
    fontSize: '21px',
    color: '#111827',
    letterSpacing: '-0.4px',
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={panelTitle}>{title}</h2>
        {children}
      </div>
    </div>
  );
}