import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../api/event.api";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
};

export default function EventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadEvents();
  }, [navigate]);

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await eventApi.getAll();

      const normalizedEvents = Array.isArray(response)
        ? response
        : response?.data || response?.events || [];

      setEvents(normalizedEvents);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  }

  function getEventId(event) {
    return event.id || event.id_event || event.event_id;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingEvent(null);
    setIsEditing(false);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingEvent(event);
    setIsEditing(true);

    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      start_date: toDatetimeLocal(event.start_date || event.date_start),
      end_date: toDatetimeLocal(event.end_date || event.date_end),
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setIsEditing(false);
    setEditingEvent(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (!form.start_date || !form.end_date) {
      setError("Les dates de début et de fin sont obligatoires.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
      };

      if (editingEvent) {
        const eventId = getEventId(editingEvent);
        await eventApi.update(eventId, payload);
      } else {
        await eventApi.create(payload);
      }

      await loadEvents();
      closeForm();
    } catch (err) {
      console.error(err);
      setError(
        editingEvent
          ? "Impossible de modifier l’événement."
          : "Impossible de créer l’événement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    const eventId = getEventId(event);

    const confirmDelete = window.confirm(
      `Voulez-vous vraiment supprimer "${event.title}" ?`
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await eventApi.delete(eventId);

      setEvents((prev) =>
        prev.filter((item) => getEventId(item) !== eventId)
      );
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l’événement.");
    }
  }

  if (loading) {
    return (
      <main style={page}>
        <div style={loadingBox}>Chargement des événements...</div>
      </main>
    );
  }

  return (
    <main style={page}>
      <section style={container}>
        <header style={header}>
          <div>
            <button style={backButton} onClick={() => navigate("/dashboard")}>
              ← Retour dashboard
            </button>

            <p style={eyebrow}>Administration</p>
            <h1 style={title}>Gestion des événements</h1>
            <p style={subtitle}>
              Créez, modifiez et supprimez les événements de la plateforme.
            </p>
          </div>

          <button style={primaryButton} onClick={openCreateForm}>
            + Nouvel événement
          </button>
        </header>

        {error && <div style={errorBox}>{error}</div>}

        {showForm && (
          <section style={formPanel}>
            <div style={formHeader}>
              <div>
                <h2 style={formTitle}>
                  {editingEvent ? "Modifier l’événement" : "Créer un événement"}
                </h2>
                <p style={formText}>
                  Remplissez les informations principales de l’événement.
                </p>
              </div>

              <button style={closeButton} onClick={closeForm}>
                Fermer
              </button>
            </div>

            <form onSubmit={handleSubmit} style={formGrid}>
              <div style={fieldFull}>
                <label style={label}>Titre</label>
                <input
                  style={input}
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ex : Conférence Tech 2026"
                />
              </div>

              <div style={fieldFull}>
                <label style={label}>Description</label>
                <textarea
                  style={textarea}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description de l’événement"
                />
              </div>

              <div>
                <label style={label}>Lieu</label>
                <input
                  style={input}
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ex : Antananarivo"
                />
              </div>

              <div>
                <label style={label}>Date de début</label>
                <input
                  style={input}
                  type="datetime-local"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={label}>Date de fin</label>
                <input
                  style={input}
                  type="datetime-local"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>

              <div style={formActions}>
                <button type="button" style={secondaryButton} onClick={closeForm}>
                  Annuler
                </button>

                <button type="submit" style={primaryButton} disabled={saving}>
                  {saving
                    ? "Enregistrement..."
                    : editingEvent
                      ? "Modifier"
                      : "Créer"}
                </button>
              </div>
            </form>
          </section>
        )}

        {!isEditing && (
          <section style={panel}>
            <div style={panelHeader}>
              <div>
                <h2 style={panelTitle}>Liste des événements</h2>
                <p style={panelText}>
                  {events.length} événement(s) trouvé(s) dans la base.
                </p>
              </div>
            </div>

            {events.length === 0 ? (
              <div style={emptyState}>
                Aucun événement trouvé. Cliquez sur “Nouvel événement” pour en créer un.
              </div>
            ) : (
              <div style={table}>
                <div style={tableHead}>
                  <span>Titre</span>
                  <span>Lieu</span>
                  <span>Début</span>
                  <span>Fin</span>
                  <span>Actions</span>
                </div>

                {events.map((event) => {
                  const eventId = getEventId(event);

                  return (
                    <div style={tableRow} key={eventId}>
                      <div>
                        <p style={eventTitle}>{event.title}</p>
                        <p style={eventDescription}>
                          {event.description || "Aucune description"}
                        </p>
                      </div>

                      <span style={tableText}>
                        {event.location || "Non défini"}
                      </span>

                      <span style={tableText}>
                        {formatDate(event.start_date || event.date_start)}
                      </span>

                      <span style={tableText}>
                        {formatDate(event.end_date || event.date_end)}
                      </span>

                      <div style={actions}>
                        <button
                          style={viewButton}
                          onClick={() => navigate(`/events/${eventId}`)}
                        >
                          Voir
                        </button>

                        <button
                          style={editButton}
                          onClick={() => openEditForm(event)}
                        >
                          Modifier
                        </button>

                        <button
                          style={deleteButton}
                          onClick={() => handleDelete(event)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>)}
      </section>
    </main>
  );
}

function formatDate(date) {
  if (!date) return "Non définie";

  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Non définie";
  }
}

function toDatetimeLocal(date) {
  if (!date) return "";

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

const page = {
  minHeight: "100vh",
  width: "100%",
  background: "#f4f6fb",
  color: "#111827",
  fontFamily: "Inter, Arial, sans-serif",
  padding: "32px",
};

const container = {
  maxWidth: "1180px",
  margin: "0 auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "24px",
  marginBottom: "28px",
};

const backButton = {
  border: "none",
  background: "transparent",
  color: "#4f46e5",
  fontWeight: "800",
  cursor: "pointer",
  marginBottom: "18px",
};

const eyebrow = {
  margin: 0,
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const title = {
  margin: "8px 0",
  fontSize: "40px",
  letterSpacing: "-1px",
};

const subtitle = {
  margin: 0,
  color: "#6b7280",
  fontSize: "16px",
};

const primaryButton = {
  border: "none",
  background: "#4f46e5",
  color: "#ffffff",
  padding: "13px 18px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(79, 70, 229, 0.22)",
};

const secondaryButton = {
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#374151",
  padding: "13px 18px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
};

const errorBox = {
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  padding: "14px 16px",
  borderRadius: "16px",
  marginBottom: "18px",
  fontWeight: "700",
};

const formPanel = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  marginBottom: "24px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "20px",
};

const formTitle = {
  margin: "0 0 6px",
  fontSize: "24px",
};

const formText = {
  margin: 0,
  color: "#6b7280",
};

const closeButton = {
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#374151",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer",
  height: "fit-content",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const fieldFull = {
  gridColumn: "1 / -1",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "800",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  fontSize: "15px",
  outline: "none",
};

const textarea = {
  ...input,
  minHeight: "110px",
  resize: "vertical",
};

const formActions = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "8px",
};

const panel = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const panelHeader = {
  marginBottom: "20px",
};

const panelTitle = {
  margin: "0 0 6px",
  fontSize: "24px",
};

const panelText = {
  margin: 0,
  color: "#6b7280",
};

const emptyState = {
  padding: "24px",
  borderRadius: "18px",
  background: "#f9fafb",
  color: "#6b7280",
  border: "1px dashed #d1d5db",
};

const table = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const tableHead = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.2fr",
  gap: "12px",
  padding: "0 14px 8px",
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.2fr",
  gap: "12px",
  alignItems: "center",
  padding: "16px 14px",
  borderRadius: "18px",
  background: "#f9fafb",
  border: "1px solid #eef0f4",
};

const eventTitle = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "900",
};

const eventDescription = {
  margin: "5px 0 0",
  color: "#6b7280",
  fontSize: "13px",
};

const tableText = {
  color: "#6b7280",
  fontSize: "14px",
};

const actions = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const viewButton = {
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#374151",
  padding: "8px 10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const editButton = {
  border: "none",
  background: "#111827",
  color: "#ffffff",
  padding: "8px 10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  padding: "8px 10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const loadingBox = {
  background: "#ffffff",
  padding: "24px 32px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  width: "fit-content",
  margin: "120px auto",
  color: "#6b7280",
};