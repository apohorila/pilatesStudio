import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import styles from './ClassSearch.module.css';
import { formatDate } from '../../utils';

const fetchAllClasses = async (typeId, date) => {
  const params = new URLSearchParams();
  if (typeId) params.append('typeId', typeId);
  if (date) params.append('date', date);

  const res = await fetch(`${API_BASE_URL}/api/classes/all?${params.toString()}`);
  if (!res.ok) return [];
  return await res.json();
};

const fetchClassTypes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/classtypes`);
  if (!res.ok) return [];
  return await res.json();
};

export default function ClassSearch() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [typeId, setTypeId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchClassTypes().then(setClassTypes);
    fetchAllClasses('', '').then(setClasses);
  }, []);

  const handleFilter = () => {
    fetchAllClasses(typeId, date).then(setClasses);
  };

  const handleReset = () => {
    setTypeId('');
    setDate('');
    fetchAllClasses('', '').then(setClasses);
  };

  const spotsLeft = (c) => c.maxCapacity - (c.bookings?.filter(
      (b) => b.status?.statusName === "Pending" || b.status?.statusName === "Confirmed"
    ).length || 0);
  

  return (
    <div className={styles.page}>
      <div className={styles.container}>

       
        <div className={styles.header}>
          <div>
            <p className={styles.label}>ЗАНЯТТЯ</p>
            <h1 className={styles.title}>Всі заняття</h1>
            <p className={styles.subtitle}>
              Оберіть заняття та запишіться онлайн.
            </p>
          </div>
        </div>

        
        <div className={styles.filters}>
          <select
            className={styles.filterInput}
            value={typeId}
            onChange={e => setTypeId(e.target.value)}>
            <option value="">Всі типи</option>
            {classTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.typeName}</option>
            ))}
          </select>

          <input
            className={styles.filterInput}
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button className={styles.filterBtn} onClick={handleFilter}>
            Фільтрувати
          </button>

          {(typeId || date) && (
            <button className={styles.resetBtn} onClick={handleReset}>
              Скинути
            </button>
          )}
        </div>

       
        <p className={styles.resultsCount}>
          Знайдено: {classes.length} занять
        </p>

        {classes.length === 0 ? (
          <p className={styles.empty}>Занять не знайдено.</p>
        ) : (
          <div className={styles.grid}>
            {classes.map(c => (
              <div key={c.id} className={styles.card}
                onClick={() => navigate(`/classes/${c.id}`)}>
                <div className={styles.cardTop}>
                  <span className={styles.typeBadge}>{c.type?.typeName}</span>
                  <span className={`${styles.spots} ${spotsLeft(c) === 0 ? styles.full : ''}`}>
                    {spotsLeft(c) === 0 ? 'Немає місць' : `${spotsLeft(c)} місць`}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{c.className}</h3>
                <p className={styles.cardMeta}>
                  👤 {c.instructor?.user?.firstName} {c.instructor?.user?.surname}
                </p>
                <p className={styles.cardMeta}>
                  📍 {c.location}
                </p>
                <p className={styles.cardMeta}>
                  🗓 {formatDate(c.scheduledAt)}
                </p>
                <p className={styles.cardDesc}>{c.description}</p>
                <button
                  className={styles.bookBtn}
                  disabled={spotsLeft(c) === 0}
                  onClick={e => { e.stopPropagation(); navigate(`/classes/${c.id}`); }}>
                  {spotsLeft(c) === 0 ? 'Місць немає' : 'Переглянути'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}