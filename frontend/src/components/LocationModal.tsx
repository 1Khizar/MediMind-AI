'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  onDecision: (allowed: boolean) => void;
}

export default function LocationModal({ onDecision }: LocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const perm = localStorage.getItem('locationPermission');
    if (!perm) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    } else if (perm === 'true') {
      onDecision(true);
    } else {
      onDecision(false);
    }
  }, [onDecision]);

  const handleAllow = () => {
    localStorage.setItem('locationPermission', 'true');
    setIsOpen(false);
    onDecision(true);
  };

  const handleDeny = () => {
    localStorage.setItem('locationPermission', 'false');
    setIsOpen(false);
    onDecision(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          style={styles.popup}
        >
          <div style={styles.header}>
            <MapPin size={16} color="var(--primary)" />
            <span style={styles.title}>http://localhost:3000 wants to</span>
            <button style={styles.closeBtn} onClick={handleDeny}>
              <X size={14} />
            </button>
          </div>
          
          <p style={styles.text}>
            Know your location
          </p>
          
          <div style={styles.actions}>
            <button style={styles.denyBtn} onClick={handleDeny}>
              Block
            </button>
            <button style={styles.allowBtn} onClick={handleAllow}>
              Allow
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles: Record<string, React.CSSProperties> = {
  popup: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    background: 'white',
    width: '320px',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  },
  title: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333',
  },
  closeBtn: {
    position: 'absolute',
    right: '-4px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  text: {
    fontSize: '14px',
    color: '#111',
    lineHeight: '1.4',
    margin: '4px 0 8px 24px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '8px',
    paddingLeft: '24px',
  },
  allowBtn: {
    background: 'var(--primary)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '24px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  denyBtn: {
    background: 'transparent',
    color: 'var(--primary)',
    padding: '6px 16px',
    borderRadius: '24px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
  }
};
