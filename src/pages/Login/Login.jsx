import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@eventsync.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiants incorrects");
        return;
      }

      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Impossible de contacter le serveur EventSync.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={page}>
      <section style={card}>
        <div style={left}>
          <div style={brand}>
            <h1 style={logo}>EventSync</h1>
            <p style={tagline}>Smart event management platform</p>
          </div>

          <div style={intro}>
            <h2 style={title}>Welcome back</h2>
            <p style={subtitle}>Sign in to access your admin dashboard.</p>
          </div>

          {error && <p style={errorBox}>{error}</p>}

          <form onSubmit={handleLogin} style={form}>
            <div>
              <label style={label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
              />
            </div>

            <div>
              <label style={label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
              />
            </div>

            <button type="submit" disabled={loading} style={button}>
              {loading ? "Connexion..." : "Sign In"}
            </button>
          </form>

          <p style={footer}>© Jeyj Gang Team — All rights reserved</p>
        </div>

        <div style={right}>
          <div style={glow}></div>

          <div style={rightContent}>
            <div style={icon}>E</div>
            <h2 style={rightTitle}>
              Smart Event
              <br />
              Management
            </h2>
            <p style={rightText}>
              Organize sessions, speakers, schedules and live engagement in one elegant platform.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  background: "#F7F6F0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "Inter, Arial, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "1040px",
  minHeight: "650px",
  background: "#FEFEFE",
  borderRadius: "32px",
  border: "1px solid #E0DED4",
  overflow: "hidden",
  display: "flex",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
};

const left = {
  width: "50%",
  padding: "56px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const brand = {
  marginBottom: "42px",
};

const logo = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "800",
  color: "#2B2B2B",
};

const tagline = {
  margin: "6px 0 0",
  color: "#908F83",
  fontSize: "14px",
};

const intro = {
  marginBottom: "24px",
};

const title = {
  margin: 0,
  fontSize: "42px",
  lineHeight: "1.1",
  color: "#2B2B2B",
};

const subtitle = {
  margin: "10px 0 0",
  color: "#5C5B57",
  fontSize: "16px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#2B2B2B",
  fontSize: "14px",
  fontWeight: "700",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #E0DED4",
  background: "#ffffff",
  color: "#2B2B2B",
  fontSize: "15px",
  outline: "none",
};

const button = {
  width: "100%",
  marginTop: "4px",
  padding: "14px",
  borderRadius: "16px",
  border: "none",
  background: "#A0A4F7",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "15px",
};

const errorBox = {
  margin: "0 0 18px",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#fee2e2",
  color: "#dc2626",
  fontSize: "14px",
};

const footer = {
  margin: "30px 0 0",
  textAlign: "center",
  color: "#908F83",
  fontSize: "12px",
};

const right = {
  width: "50%",
  position: "relative",
  background: "linear-gradient(135deg, #3E427F, #2B2B2B, #1F1F1F)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const glow = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "rgba(160, 164, 247, 0.2)",
  filter: "blur(70px)",
  top: "-120px",
  right: "-100px",
};

const rightContent = {
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  padding: "40px",
};

const icon = {
  width: "80px",
  height: "80px",
  borderRadius: "24px",
  background: "#A0A4F7",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 32px",
  fontSize: "32px",
  fontWeight: "900",
};

const rightTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "40px",
  lineHeight: "1.1",
};

const rightText = {
  margin: "22px auto 0",
  maxWidth: "360px",
  color: "#D7D7D7",
  fontSize: "16px",
  lineHeight: "1.7",
};