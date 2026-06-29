import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../../api/session.api';
import { eventApi } from '../../api/event.api';
import { roomApi } from '../../api/room.api';
import { speakerApi } from '../../api/speaker.api';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import SessionRow from './components/SessionRow';
import Modal from './components/Modal';
import { formatDate } from '../../utils/dateUtils';

// Styles globaux (copiés du Dashboard pour consistance)
const page = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  background: '#f4f6fb',
  color: '#111827',
  fontFamily: 'Inter, Arial, sans-serif',
};

const content = {
  flex: 1,
  height: '100vh',
  padding: '32px 42px',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const contentInner = {
  maxWidth: '1180px',
  margin: '0 auto',
};

const header = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '24px',
  marginBottom: '28px',
};

const eyebrow = {
  margin: 0,
  color: '#4f46e5',
  fontSize: '13px',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
};

const title = {
  margin: '8px 0 8px',
  fontSize: '40px',
  lineHeight: '1.05',
  letterSpacing: '-1.2px',
  color: '#111827',
};

const subtitle = {
  margin: 0,
  maxWidth: '620px',
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.55',
};

const headerActions = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const primaryButton = {
  border: 'none',
  background: '#4f46e5',
  color: '#ffffff',
  padding: '13px 18px',
  borderRadius: '14px',
  fontWeight: '800',
  cursor: 'pointer',
  boxShadow: '0 14px 30px rgba(79, 70, 229, 0.28)',
};

const secondaryHeaderButton = {
  border: '1px solid #e5e7eb',
  background: '#ffffff',
  color: '#374151',
  padding: '13px 16px',
  borderRadius: '14px',
  fontWeight: '700',
  cursor: 'pointer',
};

const errorBanner = {
  background: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fecaca',
  borderRadius: '16px',
  padding: '14px 16px',
  marginBottom: '18px',
  fontWeight: '700',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '18px',
  marginBottom: '24px',
};

const panel = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
};

const panelHeader = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '20px',
};

const panelTitle = {
  margin: '0 0 6px',
  fontSize: '21px',
  color: '#111827',
  letterSpacing: '-0.4px',
};

const panelText = {
  margin: 0,
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
};

const table = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const tableHead = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr',
  gap: '12px',
  padding: '0 14px 8px',
  color: '#9ca3af',
  fontSize: '12px',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const emptyState = {
  padding: '18px',
  borderRadius: '16px',
  background: '#f9fafb',
  color: '#6b7280',
  border: '1px dashed #d1d5db',
};

const loaderBox = {
  background: '#ffffff',
  padding: '24px 32px',
  borderRadius: '20px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
  textAlign: 'center',
};

const loaderText = {
  margin: 0,
  color: '#6b7280',
  fontSize: '14px',
};

// Formulaire styles
const formGroup = {
  marginBottom: '1rem',
};

const formLabel = {
  display: 'block',
  marginBottom: '0.25rem',
  fontWeight: '500',
  color: '#111827',
};

const formInput = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  border: '1px solid #d1d5db',
  borderRadius: '12px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const formRow = {
  display: 'flex',
  gap: '1rem',
};

const modalActions = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
  justifyContent: 'flex-end',
};

export default function SessionPage() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    eventId: '',
    roomId: '',
    speakerId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionsRes, eventsRes, speakersRes] = await Promise.all([
          sessionApi.getAll(),
          eventApi.getAll(),
          speakerApi.getAll(),
        ]);
        setSessions(sessionsRes || []);
        setEvents(eventsRes || []);
        setSpeakers(speakersRes || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.eventId) {
      roomApi
        .listByEvent(formData.eventId)
        .then((roomsRes) => setRooms(roomsRes || []))
        .catch(() => setRooms([]));
    } else {
      setRooms([]);
    }
  }, [formData.eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await sessionApi.update(editingSession.id, formData);
      } else {
        await sessionApi.create(formData);
      }
      const updated = await sessionApi.getAll();
      setSessions(updated || []);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’enregistrement.');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description || '',
      startTime: session.startTime,
      endTime: session.endTime,
      eventId: session.eventId,
      roomId: session.roomId,
      speakerId: session.speakerId,
    });
    if (session.eventId) {
      roomApi
        .listByEvent(session.eventId)
        .then((roomsRes) => setRooms(roomsRes || []))
        .catch(() => setRooms([]));
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette session ?')) return;
    try {
      await sessionApi.delete(id);
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      eventId: '',
      roomId: '',
      speakerId: '',
    });
    setEditingSession(null);
    setShowModal(false);
    setRooms([]);
  };

  const stats = useMemo(() => {
    const total = sessions.length;
    const upcoming = sessions.filter((s) => new Date(s.startTime) > new Date()).length;
    const now = new Date();
    const live = sessions.filter(
      (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now
    ).length;
    return { total, upcoming, live };
  }, [sessions]);

  if (loading) {
    return (
      <main style={page}>
        <Sidebar />
        <section style={content}>
          <div style={contentInner}>
            <div style={loaderBox}>
              <p style={loaderText}>Chargement des sessions...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <Sidebar />
      <section style={content}>
        <div style={contentInner}>
          <header style={header}>
            <div>
              <p style={eyebrow}>Espace organisateur</p>
              <h1 style={title}>Sessions</h1>
              <p style={subtitle}>
                Gérez l’ensemble des sessions programmées pour vos événements.
              </p>
            </div>
            <div style={headerActions}>
              <button style={secondaryHeaderButton} onClick={() => navigate('/dashboard')}>
                Retour au tableau
              </button>
              <button style={primaryButton} onClick={() => setShowModal(true)}>
                + Nouvelle session
              </button>
            </div>
          </header>

          {error && <div style={errorBanner}>{error}</div>}

          <section style={statsGrid}>
            <StatCard number={String(stats.total).padStart(2, '0')} label="Total" description="Sessions créées" tone="blue" />
            <StatCard number={String(stats.live).padStart(2, '0')} label="En cours" description="Sessions actives" tone="red" />
            <StatCard number={String(stats.upcoming).padStart(2, '0')} label="À venir" description="Sessions futures" tone="purple" />
          </section>

          <section style={panel}>
            <div style={panelHeader}>
              <div>
                <h2 style={panelTitle}>Liste des sessions</h2>
                <p style={panelText}>
                  Toutes les sessions triées par date de début (les plus récentes en premier).
                </p>
              </div>
            </div>

            <div style={table}>
              <div style={tableHead}>
                <span>Titre</span>
                <span>Événement</span>
                <span>Salle</span>
                <span>Intervenant</span>
                <span>Début</span>
                <span>Fin</span>
                <span>Actions</span>
              </div>

              {sessions.length === 0 ? (
                <div style={emptyState}>Aucune session trouvée. Créez votre première session.</div>
              ) : (
                [...sessions]
                  .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                  .map((session) => {
                    const event = events.find((e) => e.id === session.eventId);
                    const room = rooms.find((r) => r.id === session.roomId);
                    const speaker = speakers.find((s) => s.id === session.speakerId);
                    return (
                      <SessionRow
                        key={session.id}
                        session={session}
                        eventName={event?.name}
                        roomName={room?.name}
                        speakerName={speaker?.name}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    );
                  })
              )}
            </div>
          </section>
        </div>
      </section>

      <Modal isOpen={showModal} onClose={resetForm}>
        <h2 style={panelTitle}>{editingSession ? 'Modifier' : 'Créer'} une session</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={formLabel}>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={formInput}
              required
            />
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ ...formInput, minHeight: '80px' }}
              rows="3"
            />
          </div>

          <div style={formRow}>
            <div style={formGroup}>
              <label style={formLabel}>Début *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                style={formInput}
                required
              />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Fin *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                style={formInput}
                required
              />
            </div>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Événement *</label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              style={formInput}
              required
            >
              <option value="">Sélectionner</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Salle *</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              style={formInput}
              required
              disabled={!formData.eventId}
            >
              <option value="">Sélectionner</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {!formData.eventId && <small style={{ color: '#9ca3af' }}>Choisissez d’abord un événement.</small>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Intervenant *</label>
            <select
              name="speakerId"
              value={formData.speakerId}
              onChange={handleInputChange}
              style={formInput}
              required
            >
              <option value="">Sélectionner</option>
              {speakers.map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.name}
                </option>
              ))}
            </select>
          </div>

          <div style={modalActions}>
            <button type="submit" style={primaryButton}>
              {editingSession ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" style={secondaryHeaderButton} onClick={resetForm}>
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}