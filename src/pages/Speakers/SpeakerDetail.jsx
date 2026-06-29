import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

export default function SpeakerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/speaker/${id}`);
        const json = await res.json();

        setSpeaker(json.data ?? json);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [id]);

  if (!speaker) {
    return (
      <div style={{ padding: 40 }}>
        Chargement du speaker...
      </div>
    );
  }

  return (
    <main style={detailPage}>

      <div style={card}>

        <button
          style={backBtn}
          onClick={() => navigate("/speakers")}
        >
          ← Retour
        </button>

        <h1 style={{ color: "#111827" }}>
          {speaker.first_name} {speaker.last_name}
        </h1>

        <p style={{ color: "#6b7280" }}>
          {speaker.biography}
        </p>

        {speaker.photo_url && (
          <img
            src={speaker.photo_url}
            style={{
              width: 220,
              borderRadius: 16,
              marginTop: 16
            }}
          />
        )}

        <p style={{ marginTop: 10, color: "#4f46e5" }}>
          {speaker.external_link}
        </p>

      </div>

    </main>
  );
}

