import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../../api/room.api";
import { eventApi } from "../../api/event.api";

const emptyForm = {
    name: "",
    capacity: "",
};

export default function RoomsPage() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

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
            setLoadingEvents(true);
            const response = await eventApi.getAll();
            const normalized = Array.isArray(response)
                ? response
                : response?.data || response?.events || [];
            setEvents(normalized);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les événements.");
        } finally {
            setLoadingEvents(false);
        }
    }

    async function loadRooms(eventId) {
        try {
            setLoading(true);
            setError("");
            const response = await roomApi.listByEvent(eventId);
            const normalized = Array.isArray(response)
                ? response
                : response?.data || [];
            setRooms(normalized);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les salles.");
        } finally {
            setLoading(false);
        }
    }

    function handleSelectEvent(e) {
        const eventId = e.target.value;
        setSelectedEventId(eventId);
        setRooms([]);
        setShowForm(false);
        setError("");
        if (eventId) loadRooms(eventId);
    }

    function getRoomId(room) {
        return room.id_room || room.id;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function openCreateForm() {
        setEditingRoom(null);
        setForm(emptyForm);
        setShowForm(true);
    }

    function openEditForm(room) {
        setEditingRoom(room);
        setForm({
            name: room.name || "",
            capacity: room.capacity ? String(room.capacity) : "",
        });
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingRoom(null);
        setForm(emptyForm);
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Le nom de la salle est obligatoire.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                name: form.name.trim(),
                capacity: form.capacity ? Number(form.capacity) : null,
            };

            if (editingRoom) {
                await roomApi.update(selectedEventId, getRoomId(editingRoom), payload);
            } else {
                await roomApi.create(selectedEventId, payload);
            }

            await loadRooms(selectedEventId);
            closeForm();
        } catch (err) {
            console.error(err);
            setError(
                editingRoom
                    ? "Impossible de modifier la salle."
                    : "Impossible de créer la salle."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(room) {
        const confirmed = window.confirm(`Supprimer la salle "${room.name}" ?`);
        if (!confirmed) return;

        try {
            setError("");
            await roomApi.delete(selectedEventId, getRoomId(room));
            setRooms((prev) => prev.filter((r) => getRoomId(r) !== getRoomId(room)));
        } catch (err) {
            console.error(err);
            setError("Impossible de supprimer la salle.");
        }
    }

    const selectedEvent = events.find(
        (e) => String(e.id_event || e.id) === String(selectedEventId)
    );

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
                        <button style={navItem} onClick={() => navigate("/dashboard")}>Dashboard</button>
                        <button style={navItem} onClick={() => navigate("/events")}>Événements</button>
                        <button style={navItem} onClick={() => navigate("/sessions")}>Sessions</button>
                        <button style={navItem} onClick={() => navigate("/speakers")}>Intervenants</button>
                        <button style={navItemActive}>Salles</button>
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
                    <button
                        style={logoutButton}
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login", { replace: true });
                        }}
                    >
                        Déconnexion
                    </button>
                </div>
            </aside>

            <section style={content}>
                <div style={contentInner}>
                    <header style={header}>
                        <div>
                            <p style={eyebrow}>Administration</p>
                            <h1 style={title}>Salles</h1>
                            <p style={subtitle}>
                                Gérez les salles associées à chaque événement.
                            </p>
                        </div>
                        <button style={secondaryHeaderButton} onClick={() => navigate("/dashboard")}>
                            ← Dashboard
                        </button>
                    </header>

                    {error && <div style={errorBox}>{error}</div>}

                    {/* Sélecteur d'événement */}
                    <section style={panel}>
                        <h2 style={panelTitle}>Choisir un événement</h2>
                        <p style={panelText}>
                            Les salles sont liées à un événement. Sélectionnez-en un pour gérer ses salles.
                        </p>

                        <select
                            style={selectInput}
                            value={selectedEventId}
                            onChange={handleSelectEvent}
                            disabled={loadingEvents}
                        >
                            <option value="">
                                {loadingEvents ? "Chargement..." : "-- Sélectionner un événement --"}
                            </option>
                            {events.map((event) => {
                                const id = event.id_event || event.id;
                                return (
                                    <option key={id} value={id}>
                                        {event.title}
                                    </option>
                                );
                            })}
                        </select>
                    </section>

                    {/* Salles de l'événement sélectionné */}
                    {selectedEventId && (
                        <>
                            <section style={panel}>
                                <div style={panelHeader}>
                                    <div>
                                        <h2 style={panelTitle}>
                                            Salles — {selectedEvent?.title || "Événement"}
                                        </h2>
                                        <p style={panelText}>
                                            {loading
                                                ? "Chargement..."
                                                : `${rooms.length} salle(s) pour cet événement.`}
                                        </p>
                                    </div>

                                    <button style={primaryButton} onClick={openCreateForm}>
                                        + Nouvelle salle
                                    </button>
                                </div>

                                {/* Formulaire */}
                                {showForm && (
                                    <div style={formPanel}>
                                        <div style={formHeader}>
                                            <div>
                                                <h3 style={formTitle}>
                                                    {editingRoom ? "Modifier la salle" : "Nouvelle salle"}
                                                </h3>
                                                <p style={formText}>
                                                    {editingRoom
                                                        ? "Mettez à jour les informations."
                                                        : "Renseignez les informations de la salle."}
                                                </p>
                                            </div>
                                            <button style={closeButton} onClick={closeForm}>
                                                Fermer
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmit} style={formGrid}>
                                            <div>
                                                <label style={label}>Nom de la salle *</label>
                                                <input
                                                    style={input}
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Ex : Salle Zébu, Amphithéâtre A"
                                                />
                                            </div>

                                            <div>
                                                <label style={label}>Capacité</label>
                                                <input
                                                    style={input}
                                                    type="number"
                                                    name="capacity"
                                                    value={form.capacity}
                                                    onChange={handleChange}
                                                    placeholder="Ex : 150"
                                                    min="1"
                                                />
                                            </div>

                                            <div style={formActions}>
                                                <button type="button" style={secondaryButton} onClick={closeForm}>
                                                    Annuler
                                                </button>
                                                <button type="submit" style={primaryButton} disabled={saving}>
                                                    {saving
                                                        ? "Enregistrement..."
                                                        : editingRoom
                                                            ? "Modifier"
                                                            : "Créer la salle"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Liste des salles */}
                                {!loading && rooms.length === 0 && !showForm && (
                                    <div style={emptyState}>
                                        Aucune salle pour cet événement. Cliquez sur « Nouvelle salle » pour en ajouter une.
                                    </div>
                                )}

                                {rooms.length > 0 && (
                                    <div style={grid}>
                                        {rooms.map((room) => (
                                            <RoomCard
                                                key={getRoomId(room)}
                                                room={room}
                                                onEdit={() => openEditForm(room)}
                                                onDelete={() => handleDelete(room)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

function RoomCard({ room, onEdit, onDelete }) {
    return (
        <article style={card}>
            <div style={cardTop}>
                <div style={roomIconBox}>
                    {(room.name || "S").charAt(0).toUpperCase()}
                </div>
                {room.capacity && (
                    <span style={capacityBadge}>{room.capacity} pers.</span>
                )}
            </div>

            <h3 style={cardTitle}>{room.name}</h3>

            <div style={cardActions}>
                <button style={editButton} onClick={onEdit}>Modifier</button>
                <button style={deleteButton} onClick={onDelete}>Supprimer</button>
            </div>
        </article>
    );
}

/* ─── Styles ─────────────────────────────────────── */

const page = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    background: "#f4f6fb",
    color: "#111827",
    fontFamily: "Inter, Arial, sans-serif",
    overflow: "hidden",
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

const brandBox = { display: "flex", alignItems: "center", gap: "12px" };

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

const sidebarSubtitle = { margin: "3px 0 0", fontSize: "13px", color: "#9ca3af" };

const nav = { display: "flex", flexDirection: "column", gap: "8px", marginTop: "36px" };

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

const navItemActive = { ...navItem, background: "#eef2ff", color: "#4f46e5" };

const sidebarBottom = { display: "flex", flexDirection: "column", gap: "14px" };

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

const adminName = { margin: 0, fontSize: "14px", color: "#111827", fontWeight: "700" };
const adminRole = { margin: "2px 0 0", fontSize: "12px", color: "#9ca3af" };

const logoutButton = {
    border: "none",
    background: "#f3f4f6",
    color: "#374151",
    padding: "13px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    width: "100%",
    textAlign: "left",
};

const content = {
    flex: 1,
    height: "100vh",
    padding: "32px 42px",
    overflowY: "auto",
    overflowX: "hidden",
};

const contentInner = { maxWidth: "1180px", margin: "0 auto" };

const header = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
    marginBottom: "24px",
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

const subtitle = { margin: 0, color: "#6b7280", fontSize: "16px", lineHeight: "1.55" };

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

const secondaryButton = {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    padding: "13px 18px",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
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

const errorBox = {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "14px 16px",
    borderRadius: "16px",
    marginBottom: "18px",
    fontWeight: "700",
};

const panel = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const panelHeader = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "20px",
};

const panelTitle = { margin: "0 0 6px", fontSize: "21px", color: "#111827", letterSpacing: "-0.4px" };
const panelText = { margin: 0, color: "#6b7280", fontSize: "14px" };

const selectInput = {
    marginTop: "14px",
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "15px",
    color: "#111827",
    background: "#ffffff",
    outline: "none",
    cursor: "pointer",
};

const formPanel = {
    background: "#f9fafb",
    border: "1px solid #eef0f4",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "20px",
};

const formHeader = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
};

const formTitle = { margin: "0 0 4px", fontSize: "18px", color: "#111827" };
const formText = { margin: 0, color: "#6b7280", fontSize: "14px" };

const closeButton = {
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#374151",
    padding: "8px 12px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    height: "fit-content",
};

const formGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
};

const label = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "800",
    fontSize: "14px",
    color: "#111827",
};

const input = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    color: "#111827",
    background: "#ffffff",
};

const formActions = {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "4px",
};

const emptyState = {
    padding: "24px",
    borderRadius: "18px",
    background: "#f9fafb",
    color: "#6b7280",
    border: "1px dashed #d1d5db",
    textAlign: "center",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "14px",
};

const card = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const cardTop = { display: "flex", alignItems: "center", justifyContent: "space-between" };

const roomIconBox = {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
};

const capacityBadge = {
    padding: "5px 10px",
    borderRadius: "999px",
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "800",
};

const cardTitle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
    color: "#111827",
    letterSpacing: "-0.3px",
};

const cardActions = { display: "flex", gap: "8px", marginTop: "4px" };

const editButton = {
    flex: 1,
    border: "none",
    background: "#111827",
    color: "#ffffff",
    padding: "9px 10px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    textAlign: "center",
};

const deleteButton = {
    flex: 1,
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "9px 10px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    textAlign: "center",
};