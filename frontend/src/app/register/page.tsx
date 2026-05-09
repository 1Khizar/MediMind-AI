'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={styles.title}>Join MedicAI</h1>
          <p style={styles.subtitle}>Begin your professional consultation journey</p>
        </div>

        {isSuccess ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>
              <Check size={24} />
            </div>
            <p style={styles.successTitle}>Account Created!</p>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.icon} />
                  <input
                    type="text"
                    placeholder="johndoe"
                    style={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.icon} />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.icon} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.submitBtn,
                  opacity: isLoading ? 0.7 : 1,
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          </>
        )}

        <div style={styles.footer}>
          <span>Already have an account?</span>
          <Link href="/login" style={styles.link}> Sign In</Link>
        </div>
      </motion.div>
      
      <div style={styles.bgDecor}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: 'white',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 10,
    border: '1px solid var(--border)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '64px',
    height: '64px',
    background: 'var(--primary)',
    color: 'white',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--foreground)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--foreground)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    width: '100%',
    background: 'var(--primary)',
    color: 'white',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
    transition: 'all 0.2s ease',
  },
  errorBox: {
    padding: '12px',
    background: '#fef2f2',
    color: '#ef4444',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #fee2e2',
  },
  successBox: {
    padding: '24px',
    border: '1px solid rgba(32, 201, 151, 0.2)',
    background: 'rgba(32, 201, 151, 0.05)',
    borderRadius: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  successIcon: {
    width: '48px',
    height: '48px',
    background: 'var(--accent)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--accent)',
    margin: 0,
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  link: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none',
  },
  bgDecor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  circle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'rgba(0, 112, 243, 0.03)',
    top: '100px',
    left: '-100px',
  },
  circle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(32, 201, 151, 0.03)',
    top: '-100px',
    right: '-50px',
  }
};
