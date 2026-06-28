import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventApi } from "../../api/event.api";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      const res = await eventApi.getById(eventId);
      setEvent(res);
    }

    loadEvent();
  }, [eventId]);

  if (!event) {
    return <p>Chargement de l’événement...</p>;
  }

  return (
    <main style={{ padding: "32px", background: "#f4f6fb", minHeight: "100vh" }}>
      <button onClick={() => navigate("/events")}>← Retour événements</button>

      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>
        <strong>Lieu :</strong> {event.location || "Non défini"}
      </p>

      <h2>Sessions</h2>

      {(event.sessions || []).length === 0 ? (
        <p>Aucune session pour cet événement.</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {event.sessions.map((session) => (
            <div
              key={session.id}
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3>{session.title}</h3>
              <p>{session.description}</p>
              <p>Salle : {session.room?.name || "Non définie"}</p>
              {session.is_live && <strong style={{ color: "red" }}>Live</strong>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}