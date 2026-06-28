import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../api/event.api";

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  async function loadEvents() {
    const res = await eventApi.getAll();
    setEvents(res.data || []);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(eventId) {
    const ok = confirm("Supprimer cet événement ?");
    if (!ok) return;

    await eventApi.delete(eventId);
    loadEvents();
  }

  return (
    <main style={{ padding: "32px", background: "#f4f6fb", minHeight: "100vh" }}>
      <button onClick={() => navigate("/dashboard")}>← Retour dashboard</button>

      <h1>Gestion des événements</h1>

      <button onClick={() => navigate("/events/new")}>
        + Nouvel événement
      </button>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{event.title}</h3>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                {event.location || "Lieu non défini"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => navigate(`/events/${event.id}`)}>
                Voir
              </button>

              <button onClick={() => navigate(`/events/${event.id}/edit`)}>
                Modifier
              </button>

              <button onClick={() => handleDelete(event.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}