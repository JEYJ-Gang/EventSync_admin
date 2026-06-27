import { useState, useEffect } from "react";

export default function EventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (event) {
      setForm(event);
    }
  }, [event]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    onSave(form);
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ background: "#fff", padding: 20, minWidth: 300 }}>
        <h3>{event ? "Modifier Event" : "Créer Event"}</h3>

        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Lieu"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
        />

        <input
          name="end_date"
          type="date"
          value={form.end_date}
          onChange={handleChange}
        />

        <div style={{ marginTop: 10 }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}