export default function EventTable({ events, onEdit, onDelete }) {
  return (
    <table border="1" width="100%" style={{ marginTop: 20 }}>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Lieu</th>
          <th>Début</th>
          <th>Fin</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {events.map((ev) => (
          <tr key={ev.id}>
            <td>{ev.title}</td>
            <td>{ev.location}</td>
            <td>{new Date(ev.start_date).toLocaleDateString()}</td>
            <td>{new Date(ev.end_date).toLocaleDateString()}</td>

            <td>
              <button onClick={() => onEdit(ev)}>Edit</button>
              <button onClick={() => onDelete(ev.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}