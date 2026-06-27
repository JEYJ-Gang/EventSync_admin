export default function EventsTable({ events }) {
  return (
    <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Lieu</th>
          <th>Début</th>
          <th>Fin</th>
        </tr>
      </thead>

      <tbody>
        {events.map(ev => (
          <tr key={ev.id}>
            <td>{ev.title}</td>
            <td>{ev.location}</td>
            <td>{new Date(ev.start_date).toLocaleDateString()}</td>
            <td>{new Date(ev.end_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}