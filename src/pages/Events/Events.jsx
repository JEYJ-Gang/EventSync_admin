import { useCallback, useEffect, useState } from "react";
import { eventApi } from "../../api/event.api";
import EventTable from "./components/EventTable";
import EventModal from "./components/EventModal";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  async function loadEvents() {
    const data = await eventApi.getAll();
    setEvents(data.data || []);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleCreate() {
    setSelected(null);
    setOpenModal(true);
  }

  function handleEdit(event) {
    setSelected(event);
    setOpenModal(true);
  }

  async function handleDelete(id) {
    await eventApi.delete(id);
    loadEvents();
  }

  async function handleSave(formData) {
    if (selected) {
      await eventApi.update(selected.id, formData);
    } else {
      await eventApi.create(formData);
    }

    setOpenModal(false);
    loadEvents();
  }

  return (
    <div>
      <h1>Events</h1>

      <button onClick={handleCreate}>
        + Nouvel événement
      </button>

      <EventTable
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openModal && (
        <EventModal
          event={selected}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}