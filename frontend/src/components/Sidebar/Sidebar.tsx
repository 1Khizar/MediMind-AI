'use client';

import React from 'react';
import { Plus, MessageSquare, LogOut, User as UserIcon, Home, Clock } from 'lucide-react';

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>M</div>
          <span style={styles.logoText}>MedicAI</span>
        </div>
      </div>

      <button style={styles.newChatBtn}>
        <Plus size={18} />
        <span>New Consultation</span>
      </button>

      <nav style={styles.nav}>
        <div style={styles.sectionLabel}>History</div>
        <div style={styles.historyList}>
          {/* Placeholder for history items */}
          <div style={styles.historyItemActive}>
            <MessageSquare size={16} />
            <span style={styles.historyText}>General symptoms check</span>
          </div>
          <div style={styles.historyItem}>
            <MessageSquare size={16} />
            <span style={styles.historyText}>Back pain consultation</span>
          </div>
          <div style={styles.historyItem}>
            <MessageSquare size={16} />
            <span style={styles.historyText}>Nutrition advice</span>
          </div>
        </div>
      </nav>

      <div style={styles.footer}>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>
            <UserIcon size={16} />
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>Dr. Khizar</p>
            <p style={styles.userEmail}>khizar@example.com</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    background: '#f8fafc',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
  },
  header: {
    marginBottom: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'var(--primary)',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--foreground)',
  },
  newChatBtn: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    color: 'var(--foreground)',
    marginBottom: '32px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s ease',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  historyItem: {
    padding: '10px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    transition: 'all 0.2s ease',
  },
  historyItemActive: {
    padding: '10px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--primary)',
    background: 'rgba(0, 112, 243, 0.08)',
    fontWeight: '500',
  },
  historyText: {
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    background: '#e2e8f0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
  },
  userEmail: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: 0,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ef4444',
    fontSize: '14px',
    padding: '8px 4px',
    fontWeight: '500',
  }
};
