export default function StatCard({ title, value }) {
  return (
    <div style={{
      padding: 16,
      border: "1px solid #ddd",
      borderRadius: 8,
      minWidth: 150
    }}>
      <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
        {title}
      </p>
      <h2 style={{ margin: 0 }}>
        {value}
      </h2>
    </div>
  );
}