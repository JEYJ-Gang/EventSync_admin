import { formatDate } from "../../../utils/dateUtils";
export default function SessionRow({ session, eventName, roomName, speakerName, onEdit, onDelete }) {
  const tableRow = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr',
    gap: '12px',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '16px',
    background: '#f9fafb',
    border: '1px solid #eef0f4',
  };
  const eventNameStyle = {
    color: '#111827',
    fontWeight: '800',
    fontSize: '14px',
  };
  const tableText = {
    color: '#6b7280',
    fontSize: '14px',
  };
  const rowActions = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  };
  const rowButton = {
    border: 'none',
    background: '#111827',
    color: '#ffffff',
    padding: '9px 10px',
    borderRadius: '11px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
  };
  const rowButtonLight = {
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#374151',
    padding: '9px 10px',
    borderRadius: '11px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
  };

  return (
    <div style={tableRow}>
      <span style={eventNameStyle}>{session.title}</span>
      <span style={tableText}>{eventName || '—'}</span>
      <span style={tableText}>{roomName || '—'}</span>
      <span style={tableText}>{speakerName || '—'}</span>
      <span style={tableText}>{formatDate(session.startTime)}</span>
      <span style={tableText}>{formatDate(session.endTime)}</span>
      <div style={rowActions}>
        <button style={rowButtonLight} onClick={() => onEdit(session)}>
          Modifier
        </button>
        <button style={rowButton} onClick={() => onDelete(session.id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}