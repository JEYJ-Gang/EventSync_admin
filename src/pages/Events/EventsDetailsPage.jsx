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

      <main style={pageStyle}>

        <div style={cardStyle}>
          <button style={backButton} onClick={() => navigate("/events")}>← Retour événements</button>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>
            <strong>Lieu :</strong> {event.location || "Non défini"}
          </p>

          <h2 style={{ marginTop: "20px" }}>Sessions</h2>

          {(event.sessions || []).length === 0 ? (
            <p>Aucune session pour cet événement.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
              {event.sessions.map((session) => (
                <div
                  key={session.id}
                  style={sessionCard}
                >
                  <h3>{session.title}</h3>
                  <p>{session.description}</p>
                  <p>Salle : {session.room?.name || "Non définie"}</p>
                  {session.is_live && <strong style={{ color: "red" }}>Live</strong>}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

  );
}
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f4f6fb 0%, #eef2ff 100%)",
  padding: "30px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "850px",
  background: "#ffffff",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 25px 70px rgba(79, 70, 229, 0.20)",
  border: "1px solid rgba(99, 102, 241, 0.18)",
};

const sessionCard = {
  background: "#f9fafb",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
};
const backButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  background: "rgba(79, 70, 229, 0.08)",
  color: "#4f46e5",
  fontWeight: "700",
  cursor: "pointer",
  marginBottom: "20px",
};