import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import styles from "./Register.module.css";
import { useAuth } from '../../Context/AuthContext';

const blockedDomains = ['ru', 'yandex.ru', 'mail.ru', 'rambler.ru', 'bk.ru', 'list.ru', 'inbox.ru'];

const validateForm = (form) => {
  const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇєЄ'-]{2,}$/;

  if (!form.firstName || !nameRegex.test(form.firstName))
    return "Ім'я має містити мінімум 2 літери і не може містити цифри або символи.";

  if (!form.surname || !nameRegex.test(form.surname))
    return "Прізвище має містити мінімум 2 літери і не може містити цифри або символи.";

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Введіть коректний email.";

  const domain = form.email.split('@')[1];
  if (blockedDomains.some(d => domain.endsWith(d)))
    return "Реєстрація з цим поштовим сервісом недоступна.";

  if (!form.password || form.password.length < 6)
    return "Пароль має містити мінімум 6 символів.";

  if (!/[A-Z]/.test(form.password))
    return "Пароль має містити хоча б одну велику літеру.";

  if (!/[0-9]/.test(form.password))
    return "Пароль має містити хоча б одну цифру.";

  if (!/[^a-zA-Z0-9]/.test(form.password))
    return "Пароль має містити хоча б один спеціальний символ.";

  return null;
};

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', surname: '', email: '', password: ''
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    const validationError = validateForm(form);
    if (validationError) { setError(validationError); return; }
    setError(null);

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const text = await res.text();
      if (text.includes('DuplicateUserName') || text.includes('DuplicateEmail'))
        setError('Акаунт з таким email вже існує. Спробуйте увійти.');
      else
        setError('Помилка реєстрації. Спробуйте ще раз.');
      return;
    }

    const data = await res.json();
    login(data);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1>Реєстрація</h1>
      {error && <p className={styles.error}>{error}</p>}

      <input
        className={styles.input}
        placeholder="Ім'я*"
        value={form.firstName}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
      />
      <input
        className={styles.input}
        placeholder="Прізвище*"
        value={form.surname}
        onChange={e => setForm({ ...form, surname: e.target.value })}
      />
      <input
        className={styles.input}
        placeholder="Email*"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <div className={styles.passwordWrapper}>
        <input
          className={styles.input}
          placeholder="Пароль*"
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

      <p className={styles.hint}>
        Пароль: мін. 6 символів, велика літера, цифра, спеціальний символ.
      </p>

      <button className={styles.submitBtn} onClick={handleRegister}>
        Зареєструватись
      </button>
      <p className={styles.loginLink}>
        Вже є акаунт? <a href="/login">Увійти</a>
      </p>
    </div>
  );
}