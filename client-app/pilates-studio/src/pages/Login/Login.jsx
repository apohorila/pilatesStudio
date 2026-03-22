import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import styles from "./Login.module.css";
import { useAuth } from '../../Context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError('Невірний email або пароль.');
      return;
    }

    const data = await res.json();
    login(data);

    if (data.role === 'Admin') navigate('/admin');
    else if (data.role === 'Instructor') navigate(`/instructor/${data.instructorId}`);
    else navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1>Вхід</h1>
      {error && <p className={styles.error}>{error}</p>}

      <input
        className={styles.input}
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <div className={styles.passwordWrapper}>
        <input
          className={styles.input}
          placeholder="Пароль"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button
          className={styles.eyeBtn}
          onClick={() => setShowPassword(!showPassword)}
          type="button"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <button className={styles.submitBtn} onClick={handleLogin}>
        Увійти
      </button>
      <p className={styles.registerLink}>
        Немає акаунту? <a href="/register">Зареєструватись</a>
      </p>
    </div>
  );
}