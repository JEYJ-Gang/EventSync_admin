import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setIsReady(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!isReady) {
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
            <button style={navItemActive}>Dashboard</button>
            <button style={navItem}>Événements</button>
            <button style={navItem}>Sessions</button>
            <button style={navItem}>Intervenants</button>
            <button style={navItem}>Salles</button>
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
        <header style={header}>
          <div>
            <p style={eyebrow}>Espace organisateur</p>
            <h1 style={title}>Dashboard</h1>
            <p style={subtitle}>
              Gérez les événements, les sessions, les intervenants et les salles depuis une interface claire.
            </p>
          </div>

          <div style={headerActions}>
            <button style={secondaryHeaderButton}>Voir le site public</button>
            <button style={primaryButton}>+ Nouvel événement</button>
          </div>
        </header>

        <section style={statsGrid}>
          <DashboardCard
            number="03"
            label="Événements"
            description="Événements créés"
            tone="blue"
          />

          <DashboardCard
            number="12"
            label="Sessions"
            description="Sessions programmées"
            tone="purple"
          />

          <DashboardCard
            number="05"
            label="Intervenants"
            description="Profils publics"
            tone="green"
          />

          <DashboardCard
            number="02"
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
                  text="Ajouter les informations principales : titre, description, lieu et dates."
                  tag="Event"
                />

                <ActionCard
                  title="Ajouter une session"
                  text="Définir l’horaire, la salle, la capacité et les intervenants."
                  tag="Session"
                />

                <ActionCard
                  title="Gérer les intervenants"
                  text="Compléter les profils publics avec bio, photo et liens externes."
                  tag="Speaker"
                />

                <ActionCard
                  title="Organiser les salles"
                  text="Structurer le planning selon les espaces disponibles."
                  tag="Room"
                />
              </div>
            </section>

            <section style={panel}>
              <div style={panelHeader}>
                <div>
                  <h2 style={panelTitle}>Événements récents</h2>
                  <p style={panelText}>
                    Aperçu des derniers événements administrés.
                  </p>
                </div>

                <button style={smallButton}>Tout voir</button>
              </div>

              <div style={table}>
                <div style={tableHead}>
                  <span>Événement</span>
                  <span>Lieu</span>
                  <span>Statut</span>
                  <span>Actions</span>
                </div>

                <EventRow
                  name="Tech Conference 2026"
                  place="Antananarivo"
                  status="Publié"
                />

                <EventRow
                  name="Workshop Marketing"
                  place="Ivandry"
                  status="Brouillon"
                />

                <EventRow
                  name="Forum Digital"
                  place="Toamasina"
                  status="Publié"
                />
              </div>
            </section>
          </div>

          <aside style={rightColumn}>
            <section style={panel}>
              <div style={panelHeader}>
                <div>
                  <h2 style={panelTitle}>État du projet</h2>
                  <p style={panelText}>
                    Avancement des fonctionnalités demandées.
                  </p>
                </div>
              </div>

              <div style={activityList}>
                <ActivityItem
                  title="Planning public"
                  status="Disponible"
                  progress="100%"
                />

                <ActivityItem
                  title="Login admin"
                  status="Fonctionnel"
                  progress="85%"
                />

                <ActivityItem
                  title="Questions live"
                  status="À connecter"
                  progress="45%"
                />

                <ActivityItem
                  title="Pages speakers"
                  status="À finaliser"
                  progress="60%"
                />

                <ActivityItem
                  title="Favoris navigateur"
                  status="À faire"
                  progress="30%"
                />
              </div>
            </section>

            <section style={highlightPanel}>
              <p style={highlightLabel}>Session live</p>
              <h3 style={highlightTitle}>02 sessions en cours</h3>
              <p style={highlightText}>
                Les participants peuvent identifier les sessions actives et interagir avec les questions.
              </p>
              <button style={highlightButton}>Voir les sessions</button>
            </section>
          </aside>
        </section>
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

function ActionCard({ title, text, tag }) {
  return (
    <article style={actionCard}>
      <div style={actionTop}>
        <span style={actionTag}>{tag}</span>
      </div>

      <h3 style={actionTitle}>{title}</h3>
      <p style={actionText}>{text}</p>

      <button style={secondaryButton}>Ouvrir</button>
    </article>
  );
}

function EventRow({ name, place, status }) {
  const isPublished = status === "Publié";

  return (
    <div style={tableRow}>
      <span style={eventName}>{name}</span>
      <span style={tableText}>{place}</span>
      <span style={isPublished ? publishedBadge : draftBadge}>{status}</span>
      <button style={rowButton}>Modifier</button>
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

const page = {
  minHeight: "100vh",
  display: "flex",
  background: "#f4f6fb",
  color: "#111827",
  fontFamily: "Inter, Arial, sans-serif",
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
  padding: "28px 22px",
  background: "#ffffff",
  borderRight: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
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
  padding: "36px",
  overflow: "auto",
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
  fontSize: "42px",
  lineHeight: "1.05",
  letterSpacing: "-1.4px",
  color: "#111827",
};

const subtitle = {
  margin: 0,
  maxWidth: "690px",
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "1.6",
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

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const statCard = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
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
  fontSize: "34px",
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
  gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 0.9fr)",
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
  borderRadius: "26px",
  padding: "24px",
  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
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
  gridTemplateColumns: "1.4fr 1fr 0.8fr 0.7fr",
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
  gridTemplateColumns: "1.4fr 1fr 0.8fr 0.7fr",
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

const publishedBadge = {
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#ecfdf5",
  color: "#059669",
  fontSize: "12px",
  fontWeight: "800",
};

const draftBadge = {
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#fff7ed",
  color: "#ea580c",
  fontSize: "12px",
  fontWeight: "800",
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
  borderRadius: "26px",
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