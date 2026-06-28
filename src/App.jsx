import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

import EventsPage from "./pages/Events/EventsPage.jsx";
import EventDetailsPage from "./pages/Events/EventsDetailsPage.jsx";

import SessionPage from "./pages/Sessions/SessionPage.jsx";
import RoomsPage from "./pages/Rooms/RoomsPage.jsx";
import SpeakersPage from "./pages/Speakers/SpeakersPage.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function TemporaryPage({ title }) {
  return (
    <main style={{ padding: "32px", minHeight: "100vh", background: "#f4f6fb" }}>
      <h1>{title}</h1>
      <p>Page en cours de développement.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <TemporaryPage title="Créer un événement" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:eventId/edit"
          element={
            <ProtectedRoute>
              <TemporaryPage title="Modifier un événement" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/speakers"
          element={
            <ProtectedRoute>
              <SpeakersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;