import { useEffect, useState } from "react";
import { eventApi } from "../../api/event.api";
import { speakerApi } from "../../api/speaker.api";
import { Link } from "react-router-dom";

import StatCard from "./components/StatsCard";
import EventsTable from "./components/EventsTable";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [eventsRes, speakersRes] = await Promise.all([
          eventApi.getAll(),
          speakerApi.getAll(),
        ]);

        setEvents(eventsRes.data || []);
        setSpeakers(speakersRes.data || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  // 🔥 sessions live
  const liveSessions = events.reduce((acc, ev) => {
    return acc + (ev.sessions || []).filter(s => s.is_live).length;
  }, 0);

  return (
    
    <div style={{ padding: 20 }}>
      <h1>Dashboard EventSync</h1>
        <Link to="/events">
            Voir les évènements
        </Link>
      {/* STATS */}
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard title="Événements" value={events.length} />
        <StatCard title="Intervenants" value={speakers.length} />
        <StatCard title="Sessions live" value={liveSessions} />
      </div>

      {/* TABLE */}
      <h2 style={{ marginTop: 30 }}>Derniers événements</h2>
      <EventsTable events={events} />
    </div>
  );
}