import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../api/event.api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setIsReady(true);
  }, [navigate]);

  useEffect(() => {
    if (!isReady) return;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setApiError("");

        const response = await eventApi.getAll();

        const normalizedEvents = Array.isArray(response)
          ? response
          : response?.data || response?.events || [];

        setEvents(normalizedEvents);
      } catch (error) {
        console.error("Erreur chargement dashboard :", error);
        setApiError("Impossible de charger les données du dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isReady]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const stats = useMemo(() => {
    const totalEvents = events.length;

    const allSessions = events.flatMap((event) => event.sessions || []);

    const totalSessions = allSessions.length;

    const liveSessions = allSessions.filter((session) => {
      if (typeof session.is_live === "boolean") {
        return session.is_live;
      }

      if (!session.start_time || !session.end_time) {
        return false;
      }

      const now = new Date();
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      return start <= now && now <= end;
    }).length;

    const speakerIds = new Set();

    allSessions.forEach((session) => {
      const speakers = session.speakers || session.session_speakers || [];

      speakers.forEach((speakerItem) => {
        const speaker = speakerItem.speaker || speakerItem;
        const speakerId = speaker.id || speaker.id_speaker || speaker.name;

        if (speakerId) {
          speakerIds.add(speakerId);
        }
      });
    });

    return {
      totalEvents,
      totalSessions,
      totalSpeakers: speakerIds.size,
      liveSessions,
    };
  }, [events]);

  if (!isReady || loading) {
    return (
      <main style={loadingPage}>
        <div style={loaderBox}>
          <p style={loaderText}>Chargement du dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <aside style={sidebar}>
        <div>
          <div style={brandBox}>
            <div style={brandIcon}>E</div>
            <div>
              <h2 style={logo}>EventSync</h2>
              <p style={sidebarSubtitle}>Admin panel</p>
            </div>
          </div>

          <nav style={nav}>
            <button style={navItemActive} onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>

            <button style={navItem} onClick={() => navigate("/events")}>
              Événements
            </button>

            <button style={navItem} onClick={() => navigate("/sessions")}>
              Sessions
            </button>

            <button style={navItem} onClick={() => navigate("/speakers")}>
              Intervenants
            </button>

            <button style={navItem} onClick={() => navigate("/rooms")}>
              Salles
            </button>
          </nav>
        </div>

        <div style={sidebarBottom}>
          <div style={adminCard}>
            <div style={avatar}>A</div>
            <div>
              <p style={adminName}>Admin</p>
              <p style={adminRole}>Organisateur</p>
            </div>
          </div>

          <button onClick={handleLogout} style={logoutButton}>
            Déconnexion
          </button>
        </div>
      </aside>

      <section style={content}>
        <div style={contentInner}>
          <header style={header}>
            <div>
              <p style={eyebrow}>Espace organisateur</p>
              <h1 style={title}>Dashboard</h1>
              <p style={subtitle}>
                Gérez les événements, les sessions, les intervenants et les salles depuis une interface claire.
              </p>
            </div>

            <div style={headerActions}>
              <button
                style={secondaryHeaderButton}
                onClick={() => window.open("http://localhost:3000", "_blank")}
              >
                Voir le site public
              </button>

              <button
                style={primaryButton}
                onClick={() => navigate("/events/new")}
              >
                + Nouvel événement
              </button>
            </div>
          </header>

          {apiError && <div style={errorBanner}>{apiError}</div>}

          <section style={statsGrid}>
            <DashboardCard
              number={formatNumber(stats.totalEvents)}
              label="Événements"
              description="Événements créés"
              tone="blue"
            />

            <DashboardCard
              number={formatNumber(stats.totalSessions)}
              label="Sessions"
              description="Sessions programmées"
              tone="purple"
            />

            <DashboardCard
              number={formatNumber(stats.totalSpeakers)}
              label="Intervenants"
              description="Profils publics"
              tone="green"
            />

            <DashboardCard
              number={formatNumber(stats.liveSessions)}
              label="Live"
              description="Sessions en cours"
              tone="red"
              live
            />
          </section>

          <section style={mainGrid}>
            <div style={leftColumn}>
              <section style={panel}>
                <div style={panelHeader}>
                  <div>
                    <h2 style={panelTitle}>Actions rapides</h2>
                    <p style={panelText}>
                      Les raccourcis essentiels pour administrer la plateforme.
                    </p>
                  </div>
                </div>

                <div style={actionsGrid}>
                  <ActionCard
                    title="Créer un événement"
                    text="Ajouter le titre, la description, le lieu et les dates."
                    tag="Event"
                    onClick={() => navigate("/events/new")}
                  />

                  <ActionCard
                    title="Gérer les événements"
                    text="Consulter, modifier ou supprimer les événements existants."
                    tag="Event"
                    onClick={() => navigate("/events")}
                  />

                  <ActionCard
                    title="Gérer les sessions"
                    text="Définir les horaires, les salles et les intervenants."
                    tag="Session"
                    onClick={() => navigate("/sessions")}
                  />

                  <ActionCard
                    title="Gérer les salles"
                    text="Organiser les rooms utilisées dans les plannings."
                    tag="Room"
                    onClick={() => navigate("/rooms")}
                  />
                </div>
              </section>

              <section style={panel}>
                <div style={panelHeader}>
                  <div>
                    <h2 style={panelTitle}>Événements récents</h2>
                    <p style={panelText}>
                      Aperçu des derniers événements disponibles dans la base.
                    </p>
                  </div>

                  <button style={smallButton} onClick={() => navigate("/events")}>
                    Tout voir
                  </button>
                </div>

                <div style={table}>
                  <div style={tableHead}>
                    <span>Événement</span>
                    <span>Lieu</span>
                    <span>Date</span>
                    <span>Actions</span>
                  </div>

                  {events.length === 0 ? (
                    <div style={emptyState}>
                      Aucun événement trouvé. Créez votre premier événement.
                    </div>
                  ) : (
                    events.slice(0, 5).map((event) => {
                      const eventId = getEventId(event);

                      return (
                        <EventRow
                          key={eventId}
                          name={event.title || "Événement sans titre"}
                          place={event.location || "Lieu non défini"}
                          date={event.start_date || event.date_start}
                          onView={() => navigate(`/events/${eventId}`)}
                          onEdit={() => navigate(`/events/${eventId}/edit`)}
                        />
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            <aside style={rightColumn}>
              <section style={panel}>
                <div style={panelHeader}>
                  <div>
                    <h2 style={panelTitle}>État du projet</h2>
                    <p style={panelText}>
                      Avancement des fonctionnalités principales.
                    </p>
                  </div>
                </div>

                <div style={activityList}>
                  <ActivityItem
                    title="Login admin"
                    status="Connecté à l’API"
                    progress="100%"
                  />

                  <ActivityItem
                    title="Dashboard dynamique"
                    status="Données réelles"
                    progress="90%"
                  />

                  <ActivityItem
                    title="Gestion événements"
                    status="À finaliser"
                    progress="70%"
                  />

                  <ActivityItem
                    title="Sessions / salles"
                    status="À connecter"
                    progress="50%"
                  />

                  <ActivityItem
                    title="Questions live"
                    status="À développer"
                    progress="35%"
                  />
                </div>
              </section>

              <section style={highlightPanel}>
                <p style={highlightLabel}>Session live</p>
                <h3 style={highlightTitle}>
                  {formatNumber(stats.liveSessions)} session(s) en cours
                </h3>
                <p style={highlightText}>
                  Les sessions live seront visibles par les participants sur l’interface publique.
                </p>
                <button
                  style={highlightButton}
                  onClick={() => navigate("/sessions")}
                >
                  Voir les sessions
                </button>
              </section>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ number, label, description, tone, live }) {
  const toneStyle = {
    blue: {
      background: "#eff6ff",
      color: "#2563eb",
    },
    purple: {
      background: "#f5f3ff",
      color: "#7c3aed",
    },
    green: {
      background: "#ecfdf5",
      color: "#059669",
    },
    red: {
      background: "#fef2f2",
      color: "#dc2626",
    },
  };

  return (
    <article style={statCard}>
      <div style={statTop}>
        <span style={{ ...statIcon, ...toneStyle[tone] }}>
          {label.charAt(0)}
        </span>

        {live && <span style={liveBadge}>Live</span>}
      </div>

      <span style={statNumber}>{number}</span>
      <h3 style={statLabel}>{label}</h3>
      <p style={statDescription}>{description}</p>
    </article>
  );
}

function ActionCard({ title, text, tag, onClick }) {
  return (
    <article style={actionCard}>
      <div style={actionTop}>
        <span style={actionTag}>{tag}</span>
      </div>

      <h3 style={actionTitle}>{title}</h3>
      <p style={actionText}>{text}</p>

      <button style={secondaryButton} onClick={onClick}>
        Ouvrir
      </button>
    </article>
  );
}

function EventRow({ name, place, date, onView, onEdit }) {
  return (
    <div style={tableRow}>
      <span style={eventName}>{name}</span>
      <span style={tableText}>{place}</span>
      <span style={tableText}>{formatDate(date)}</span>

      <div style={rowActions}>
        <button style={rowButtonLight} onClick={onView}>
          Voir
        </button>

        <button style={rowButton} onClick={onEdit}>
          Modifier
        </button>
      </div>
    </div>
  );
}

function ActivityItem({ title, status, progress }) {
  return (
    <div style={activityItem}>
      <div style={activityHeader}>
        <div>
          <p style={activityTitle}>{title}</p>
          <p style={activityStatus}>{status}</p>
        </div>

        <span style={progressText}>{progress}</span>
      </div>

      <div style={progressBar}>
        <div style={{ ...progressFill, width: progress }}></div>
      </div>
    </div>
  );
}

function formatNumber(value) {
  return String(value || 0).padStart(2, "0");
}

function getEventId(event) {
  return event.id || event.id_event || event.event_id;
}

function formatDate(date) {
  if (!date) return "Non définie";

  try {
    return new Date(date).toLocaleDateString("fr-FR");
  } catch {
    return "Non définie";
  }
}

const page = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  background: "#f4f6fb",
  color: "#111827",
  fontFamily: "Inter, Arial, sans-serif",
  overflow: "hidden",
};

const loadingPage = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f4f6fb",
  fontFamily: "Inter, Arial, sans-serif",
};

const loaderBox = {
  background: "#ffffff",
  padding: "24px 32px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
  textAlign: "center",
};

const loaderText = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
};

const sidebar = {
  width: "280px",
  minWidth: "280px",
  padding: "28px 22px",
  background: "#ffffff",
  borderRight: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100vh",
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const brandIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "18px",
  boxShadow: "0 12px 24px rgba(79, 70, 229, 0.28)",
};

const logo = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  color: "#111827",
};

const sidebarSubtitle = {
  margin: "3px 0 0",
  fontSize: "13px",
  color: "#9ca3af",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "36px",
};

const navItem = {
  width: "100%",
  textAlign: "left",
  border: "none",
  padding: "13px 14px",
  borderRadius: "14px",
  color: "#6b7280",
  background: "transparent",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "600",
};

const navItemActive = {
  ...navItem,
  background: "#eef2ff",
  color: "#4f46e5",
};

const sidebarBottom = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const adminCard = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "16px",
  background: "#f9fafb",
  border: "1px solid #eef0f4",
};

const avatar = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#111827",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
};

const adminName = {
  margin: 0,
  fontSize: "14px",
  color: "#111827",
  fontWeight: "700",
};

const adminRole = {
  margin: "2px 0 0",
  fontSize: "12px",
  color: "#9ca3af",
};

const logoutButton = {
  border: "none",
  background: "#f3f4f6",
  color: "#374151",
  padding: "13px 14px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "700",
};

const content = {
  flex: 1,
  height: "100vh",
  padding: "32px 42px",
  overflowY: "auto",
  overflowX: "hidden",
};

const contentInner = {
  maxWidth: "1180px",
  margin: "0 auto",
};

const header = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "24px",
  marginBottom: "28px",
};

const eyebrow = {
  margin: 0,
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const title = {
  margin: "8px 0 8px",
  fontSize: "40px",
  lineHeight: "1.05",
  letterSpacing: "-1.2px",
  color: "#111827",
};

const subtitle = {
  margin: 0,
  maxWidth: "620px",
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "1.55",
};

const headerActions = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const primaryButton = {
  border: "none",
  background: "#4f46e5",
  color: "#ffffff",
  padding: "13px 18px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(79, 70, 229, 0.28)",
};

const secondaryHeaderButton = {
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#374151",
  padding: "13px 16px",
  borderRadius: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

const errorBanner = {
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
  fontWeight: "700",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const statCard = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "22px",
  minHeight: "185px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const statTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "18px",
};

const statIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const statNumber = {
  display: "block",
  fontSize: "32px",
  lineHeight: "1",
  fontWeight: "900",
  color: "#111827",
  letterSpacing: "-1px",
};

const statLabel = {
  margin: "12px 0 6px",
  fontSize: "16px",
  color: "#111827",
};

const statDescription = {
  margin: 0,
  fontSize: "14px",
  lineHeight: "1.45",
  color: "#6b7280",
};

const liveBadge = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#fee2e2",
  color: "#dc2626",
  fontSize: "12px",
  fontWeight: "900",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.85fr)",
  gap: "24px",
};

const leftColumn = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const rightColumn = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const panel = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const panelHeader = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "20px",
};

const panelTitle = {
  margin: "0 0 6px",
  fontSize: "21px",
  color: "#111827",
  letterSpacing: "-0.4px",
};

const panelText = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
};

const actionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
};

const actionCard = {
  padding: "18px",
  borderRadius: "20px",
  background: "#f9fafb",
  border: "1px solid #eef0f4",
};

const actionTop = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "14px",
};

const actionTag = {
  padding: "6px 9px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "12px",
  fontWeight: "800",
};

const actionTitle = {
  margin: "0 0 8px",
  fontSize: "16px",
  color: "#111827",
};

const actionText = {
  margin: "0 0 16px",
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.55",
};

const secondaryButton = {
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#374151",
  padding: "9px 12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const smallButton = {
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#374151",
  padding: "9px 12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const table = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const tableHead = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 0.8fr 1fr",
  gap: "12px",
  padding: "0 14px 8px",
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 0.8fr 1fr",
  gap: "12px",
  alignItems: "center",
  padding: "14px",
  borderRadius: "16px",
  background: "#f9fafb",
  border: "1px solid #eef0f4",
};

const eventName = {
  color: "#111827",
  fontWeight: "800",
  fontSize: "14px",
};

const tableText = {
  color: "#6b7280",
  fontSize: "14px",
};

const rowActions = {
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
};

const rowButton = {
  border: "none",
  background: "#111827",
  color: "#ffffff",
  padding: "9px 10px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
};

const rowButtonLight = {
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#374151",
  padding: "9px 10px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
};

const emptyState = {
  padding: "18px",
  borderRadius: "16px",
  background: "#f9fafb",
  color: "#6b7280",
  border: "1px dashed #d1d5db",
};

const activityList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const activityItem = {
  padding: "14px",
  borderRadius: "18px",
  background: "#f9fafb",
  border: "1px solid #eef0f4",
};

const activityHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "10px",
};

const activityTitle = {
  margin: 0,
  fontSize: "14px",
  fontWeight: "800",
  color: "#111827",
};

const activityStatus = {
  margin: "4px 0 0",
  fontSize: "13px",
  color: "#6b7280",
};

const progressText = {
  fontSize: "13px",
  color: "#4f46e5",
  fontWeight: "900",
};

const progressBar = {
  height: "8px",
  background: "#e5e7eb",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
  borderRadius: "999px",
};

const highlightPanel = {
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(79, 70, 229, 0.3)",
};

const highlightLabel = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.85,
};

const highlightTitle = {
  margin: "12px 0 8px",
  fontSize: "24px",
  letterSpacing: "-0.5px",
};

const highlightText = {
  margin: "0 0 18px",
  color: "rgba(255, 255, 255, 0.82)",
  fontSize: "14px",
  lineHeight: "1.6",
};

const highlightButton = {
  border: "none",
  background: "#ffffff",
  color: "#4f46e5",
  padding: "11px 14px",
  borderRadius: "13px",
  cursor: "pointer",
  fontWeight: "900",
};