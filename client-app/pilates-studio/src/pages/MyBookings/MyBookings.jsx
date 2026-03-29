import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import API_BASE_URL from "../../config";
import styles from "./MyBookings.module.css";

const fetchMyBookings = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/api/bookings/user/${userId}`);
  if (!res.ok) return [];
  return await res.json();
};

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("active"); // 'active' | 'past'

  useEffect(() => {
    if (user?.id) fetchMyBookings(user.id).then(setBookings);
  }, [user]);

  const now = new Date();

  const activeBookings = bookings.filter((b) => {
    const isPast = new Date(b.class?.scheduledAt) < now;
    const isCancelled = b.status?.statusName === "Cancelled";
    return !isPast && !isCancelled;
  });

  const pastBookings = bookings.filter((b) => {
    const isPast = new Date(b.class?.scheduledAt) < now;
    const isCancelled = b.status?.statusName === "Cancelled";
    return isPast || isCancelled;
  });

  const displayed = tab === "active" ? activeBookings : pastBookings;

  const statusColor = (name) => {
    if (name === "Confirmed") return "#2ecc71";
    if (name === "Cancelled") return "#e74c3c";
    if (name === "Attended") return "#3498db";
    return "#f39c12";
  };

  const handleCancel = async (bookingId) => {
    await fetch(`${API_BASE_URL}/api/classes/bookings/${bookingId}/cancel`, {
      method: "PUT",
    });
    fetchMyBookings(user.id).then(setBookings);
  };

  if (!user) return <p>Будь ласка, увійдіть в систему.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Мої записи</h1>
        <button
          className={styles.exportBtn}
          onClick={() => {
            window.location.href = `${API_BASE_URL}/api/bookings/export/user/${user.id}`;
          }}
        >
          📥 Завантажити звіт
        </button>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "active" ? styles.activeTab : ""}`}
            onClick={() => setTab("active")}
          >
            Активні ({activeBookings.length})
          </button>
          <button
            className={`${styles.tab} ${tab === "past" ? styles.activeTab : ""}`}
            onClick={() => setTab("past")}
          >
            Минулі ({pastBookings.length})
          </button>
        </div>

        {/* Bookings list */}
        {displayed.length === 0 ? (
          <p className={styles.empty}>
            {tab === "active"
              ? "Немає активних записів."
              : "Немає минулих записів."}
          </p>
        ) : (
          <div className={styles.list}>
            {displayed.map((b) => (
              <div key={b.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <h3 className={styles.className}>{b.class?.className}</h3>
                  <div className={styles.meta}>
                    <span>📍 {b.class?.location}</span>
                    <span>·</span>
                    <span>
                      🗓{" "}
                      {new Date(b.class?.scheduledAt).toLocaleString("uk-UA")}
                    </span>
                    <span>·</span>
                    <span>
                      👤 {b.class?.instructor?.user?.firstName}{" "}
                      {b.class?.instructor?.user?.surname}
                    </span>
                  </div>
                  <span
                    className={styles.status}
                    style={{ color: statusColor(b.status?.statusName) }}
                  >
                    {b.status?.statusName}
                  </span>
                </div>
                <div className={styles.cardRight}>
                  <button
                    className={styles.detailBtn}
                    onClick={() => navigate(`/classes/${b.class?.id}`)}
                  >
                    Деталі
                  </button>
                  {tab === "active" && b.status?.statusName !== "Cancelled" && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancel(b.id)}
                    >
                      Скасувати
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
