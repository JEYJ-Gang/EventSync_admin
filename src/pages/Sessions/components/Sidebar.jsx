import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Événements' },
    { path: '/sessions', label: 'Sessions' },
    { path: '/speakers', label: 'Intervenants' },
    { path: '/rooms', label: 'Salles' },
  ];

  return (
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
          {navItems.map((item) => (
            <button
              key={item.path}
              style={location.pathname === item.path ? navItemActive : navItem}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
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
  );
};

const sidebar = {
  width: '280px',
  minWidth: '280px',
  padding: '28px 22px',
  background: '#ffffff',
  borderRight: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100vh',
};

const brandBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const brandIcon = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
  fontSize: '18px',
  boxShadow: '0 12px 24px rgba(79, 70, 229, 0.28)',
};

const logo = {
  margin: 0,
  fontSize: '22px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  color: '#111827',
};

const sidebarSubtitle = {
  margin: '3px 0 0',
  fontSize: '13px',
  color: '#9ca3af',
};

const nav = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '36px',
};

const navItem = {
  width: '100%',
  textAlign: 'left',
  border: 'none',
  padding: '13px 14px',
  borderRadius: '14px',
  color: '#6b7280',
  background: 'transparent',
  fontSize: '15px',
  cursor: 'pointer',
  fontWeight: '600',
};

const navItemActive = {
  ...navItem,
  background: '#eef2ff',
  color: '#4f46e5',
};

const sidebarBottom = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const adminCard = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '16px',
  background: '#f9fafb',
  border: '1px solid #eef0f4',
};

const avatar = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: '#111827',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
};

const adminName = {
  margin: 0,
  fontSize: '14px',
  color: '#111827',
  fontWeight: '700',
};

const adminRole = {
  margin: '2px 0 0',
  fontSize: '12px',
  color: '#9ca3af',
};

const logoutButton = {
  border: 'none',
  background: '#f3f4f6',
  color: '#374151',
  padding: '13px 14px',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: '700',
};

export default Sidebar;