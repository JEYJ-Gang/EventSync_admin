"use client";

import { useEffect, useState } from "react";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadSpeakers() {
    try {
      const res = await fetch("/api/speaker"); // ou /api/speakers selon ton backend
      const json = await res.json();

      setSpeakers(json.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadSpeakers();
}, []);
if (loading) {
  return (
    <div style={{ padding: "40px" }}>
      Chargement des intervenants...
    </div>
  );
}
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        {/* HEADER */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Intervenants</h1>

          <button style={createButton}>
            + Ajouter un intervenant
          </button>
        </div>

        {/* LIST */}
        <div style={table}>

          {speakers.map((sp) => (
            <div key={sp.id_speaker} style={row}>

              {/* AVATAR */}
              <div style={avatar}>
                {sp.photo_url ? (
                  <img
                    src={sp.photo_url}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  sp.first_name?.[0] + sp.last_name?.[0]
                )}
              </div>

              {/* NAME */}
              <div>
                <strong>{sp.first_name} {sp.last_name}</strong>
              </div>

              {/* BIO */}
              <div style={{ color: "#6b7280" }}>
                {sp.biography?.slice(0, 50)}...
              </div>

              {/* LINK */}
              <div style={{ color: "#4f46e5" }}>
                Voir profil
              </div>

              {/* ACTIONS */}
              <div style={actions}>

                <button style={viewBtn}>
                  Voir
                </button>

                <button style={editBtn}>
                  Modifier
                </button>

                <button style={deleteBtn}>
                  Supprimer
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #f4f6fb 0%, #eef2ff 100%)",
  display: "flex",
  justifyContent: "center",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1100px",
  background: "#ffffff",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 25px 70px rgba(79, 70, 229, 0.18)",
  border: "1px solid rgba(99, 102, 241, 0.15)",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "900",
  color: "#111827",
};

const createButton = {
  background: "#4f46e5",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(79,70,229,0.25)",
};
const table = {
  display: "grid",
  gap: "12px",
};

const row = {
  display: "grid",
  gridTemplateColumns: "80px 1fr 1fr 1fr 220px",
  alignItems: "center",
  padding: "14px",
  borderRadius: "18px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};
const avatar = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "rgba(79,70,229,0.1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "900",
  color: "#4f46e5",
  overflow: "hidden",
};
const actions = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
};
const baseBtn = {
  padding: "6px 10px",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  border: "none",
};

const viewBtn = {
  ...baseBtn,
  background: "#e0e7ff",
  color: "#4f46e5",
};

const editBtn = {
  ...baseBtn,
  background: "#111827",
  color: "#fff",
};

const deleteBtn = {
  ...baseBtn,
  background: "#fee2e2",
  color: "#dc2626",
};
