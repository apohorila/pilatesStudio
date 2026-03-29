// pages/Instructor.jsx
import { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import styles from "./InstructorDashboard.module.css";

const fetchClasses = async (instructorId) => {
  const res = await fetch(
    `${API_BASE_URL}/api/classes/instructor/${instructorId}`,
  );
  if (!res.ok) return [];
  return await res.json();
};

const fetchClassTypes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/classtypes`);
  if (!res.ok) return [];
  return await res.json();
};

export default function Instructor() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const instructorId = user.instructorId;

  const [classes, setClasses] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);
  const [classForm, setClassForm] = useState({
    ClassName: "",
    ScheduledAt: "",
    TypeId: "",
    MaxCapacity: "",
    Description: "",
    Location: "",
  });

  useEffect(() => {
    if (instructorId) {
      fetchClasses(instructorId).then(setClasses);
      fetchClassTypes().then(setClassTypes);
    }
  }, [instructorId]);

  const handleAddClass = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/classes?instructorId=${instructorId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm),
      },
    );
    if (res.ok) {
      fetchClasses(instructorId).then(setClasses);
      setClassForm({
        ClassName: "",
        ScheduledAt: "",
        TypeId: "",
        MaxCapacity: "",
        Description: "",
        Location: "",
      });
      setShowForm(false);
    }
  };

  const handleDeleteClass = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/classes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setClasses(classes.filter((c) => c.id !== id));
  };

  const handleConfirm = async (bookingId, classId) => {
    await fetch(`${API_BASE_URL}/api/classes/bookings/${bookingId}/confirm`, {
      method: "PUT",
    });
    fetchClasses(instructorId).then(setClasses);
  };

  const handleCancel = async (bookingId) => {
    await fetch(`${API_BASE_URL}/api/classes/bookings/${bookingId}/cancel`, {
      method: "PUT",
    });
    fetchClasses(instructorId).then(setClasses);
  };

  const statusColor = (statusName) => {
    if (statusName === "Confirmed") return "#2ecc71";
    if (statusName === "Cancelled") return "#e74c3c";
    return "#f39c12";
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Панель інструктора</p>
            <h1 className={styles.title}>Мої класи</h1>
            <p className={styles.subtitle}>
              Керуйте заняттями та записами на них.
            </p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Скасувати" : "+ Нове звняття"}
          </button>
        </div>

        {showForm && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>Нове заняття</h3>
            <div className={styles.formRow}>
              <input
                className={styles.input}
                placeholder="Назва заняття"
                value={classForm.ClassName}
                onChange={(e) =>
                  setClassForm({ ...classForm, ClassName: e.target.value })
                }
              />

              <select
                className={styles.input}
                value={classForm.TypeId}
                onChange={(e) =>
                  setClassForm({ ...classForm, TypeId: e.target.value })
                }
              >
                <option value="">Оберіть тип</option>
                {classTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.typeName}
                  </option>
                ))}
              </select>

              <input
                className={styles.input}
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                max={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
                value={classForm.ScheduledAt}
                onChange={(e) =>
                  setClassForm({ ...classForm, ScheduledAt: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Max Capacity"
                min={1}
                type="number"
                value={classForm.MaxCapacity}
                onChange={(e) =>
                  setClassForm({ ...classForm, MaxCapacity: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Location"
                value={classForm.Location}
                onChange={(e) =>
                  setClassForm({ ...classForm, Location: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Description"
                value={classForm.Description}
                onChange={(e) =>
                  setClassForm({ ...classForm, Description: e.target.value })
                }
              />

              <button className={styles.saveBtn} onClick={handleAddClass}>
                Додати заняття
              </button>
            </div>
          </div>
        )}

        {classes.length === 0 ? (
          <p className={styles.empty}>Ще немає занять</p>
        ) : (
          classes.map((c) => (
            <div key={c.id} className={styles.classCard}>
              <div className={styles.classHeader}>
                <div>
                  <h3 className={styles.className}>{c.className}</h3>
                  <p className={styles.classMeta}>
                    {c.type?.typeName} · {c.location} ·{" "}
                    {new Date(c.scheduledAt).toLocaleString()} · {c.maxCapacity}{" "}
                    місця
                  </p>
                  <p className={styles.classDesc}>{c.description}</p>
                </div>
                <div className={styles.classActions}>
                  <button
                    className={styles.expandBtn}
                    onClick={() =>
                      setExpandedClass(expandedClass === c.id ? null : c.id)
                    }
                  >
                    {expandedClass === c.id
                      ? "Hide Bookings"
                      : `Bookings (${c.bookings?.length || 0})`}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClass(c.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>

              {expandedClass === c.id && (
                <div className={styles.bookings}>
                  <h4 className={styles.bookingsTitle}>Запити</h4>
                  {c.bookings?.length === 0 ? (
                    <p className={styles.empty}>Ще немає запитів</p>
                  ) : (
                    c.bookings.map((b) => (
                      <div key={b.id} className={styles.bookingRow}>
                        <div>
                          <span className={styles.bookingName}>
                            {b.user?.firstName} {b.user?.surname}
                          </span>
                          <span className={styles.bookingEmail}>
                            {b.user?.email}
                          </span>
                        </div>
                        <div className={styles.bookingRight}>
                          <span
                            style={{
                              color: statusColor(b.status?.statusName),
                              fontSize: "13px",
                            }}
                          >
                            {b.status?.statusName}
                          </span>
                          {b.status?.statusName === "Pending" && (
                            <>
                              <button
                                className={styles.confirmBtn}
                                onClick={() => handleConfirm(b.id, c.id)}
                              >
                                Confirm
                              </button>
                              <button
                                className={styles.rejectBtn}
                                onClick={() => handleCancel(b.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
