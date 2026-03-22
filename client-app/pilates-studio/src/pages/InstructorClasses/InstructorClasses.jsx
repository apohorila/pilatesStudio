import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import styles from "./InstructorClasses.module.css";
import { formatDate } from "../../utils";

const fetchClasses = async (instructorId) => {
  const res = await fetch(`${API_BASE_URL}/api/classes/instructor/${instructorId}`);
  if (!res.ok) return [];
  return await res.json();
};

const fetchClassTypes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/classtypes`);
  if (res.status === 404) return [];
  if (!res.ok) return [];
  return await res.json();
};

const now = () => new Date().toISOString().slice(0, 16);

const validateClassForm = (form) => {
  if (!form.ClassName) return "Введіть назву заняття.";
  if (!form.ScheduledAt) return "Оберіть дату та час.";
  if (new Date(form.ScheduledAt) < new Date()) return "Дата не може бути в минулому.";
  if (!form.MaxCapacity || parseInt(form.MaxCapacity) < 1) return "Кількість місць має бути більше 0.";
  if (!form.Location) return "Введіть локацію.";
  return null;
};

export default function InstructorClasses() {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [editError, setEditError] = useState("");
  const [classForm, setClassForm] = useState({
    ClassName: "",
    ScheduledAt: "",
    TypeId: "",
    MaxCapacity: "",
    Description: "",
    Location: "",
  });
  const [editingClassId, setEditingClassId] = useState(null);
  const [editForm, setEditForm] = useState({
    ClassName: "",
    ScheduledAt: "",
    TypeId: "",
    MaxCapacity: "",
    Description: "",
    Location: "",
  });

  useEffect(() => {
    fetchClasses(instructorId).then(setClasses);
    fetchClassTypes().then(setClassTypes);
  }, [instructorId]);

  const handleAddClass = async () => {
    const error = validateClassForm(classForm);
    if (error) { setFormError(error); return; }
    setFormError("");

    const res = await fetch(`${API_BASE_URL}/api/classes?instructorId=${instructorId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classForm),
    });

    if (res.ok) {
      fetchClasses(instructorId).then(setClasses);
      setClassForm({ ClassName: "", ScheduledAt: "", TypeId: "", MaxCapacity: "", Description: "", Location: "" });
      setShowForm(false);
    } else {
      const text = await res.text();
      setFormError(text);
    }
  };

  const handleDeleteClass = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/classes/${id}`, { method: "DELETE" });
    if (res.ok) setClasses(classes.filter((c) => c.id !== id));
  };

  const startEdit = (c) => {
    setEditingClassId(c.id);
    setEditError("");
    setEditForm({
      ClassName: c.className,
      ScheduledAt: c.scheduledAt?.slice(0, 16),
      TypeId: c.typeId || "",
      MaxCapacity: c.maxCapacity || "",
      Description: c.description || "",
      Location: c.location || "",
    });
  };

  const handleEditClass = async (id) => {
    const error = validateClassForm(editForm);
    if (error) { setEditError(error); return; }
    setEditError("");

    const res = await fetch(`${API_BASE_URL}/api/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      fetchClasses(instructorId).then(setClasses);
      setEditingClassId(null);
    } else {
      const text = await res.text();
      setEditError(text);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Вітаємо!</p>
            <h1 className={styles.title}>Мої заняття</h1>
            <p className={styles.subtitle}>Керуйте вашими заняттями та записами клієнтів.</p>
          </div>
          <button className={styles.addBtn} onClick={() => { setShowForm(!showForm); setFormError(""); }}>
            {showForm ? "✕ Скасувати" : "+ Нове заняття"}
          </button>
        </div>

        {showForm && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>Нове заняття</h3>
            {formError && <p style={{ color: '#e74c3c', marginBottom: '12px' }}>{formError}</p>}
            <div className={styles.formRow}>
              <input
                className={styles.input}
                placeholder="Назва заняття"
                value={classForm.ClassName}
                onChange={(e) => setClassForm({ ...classForm, ClassName: e.target.value })}
              />
              <select
                className={styles.input}
                value={classForm.TypeId}
                onChange={(e) => setClassForm({ ...classForm, TypeId: e.target.value })}
              >
                <option value="">Оберіть тип заняття</option>
                {classTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>{ct.typeName}</option>
                ))}
              </select>
              <input
                className={styles.input}
                type="datetime-local"
                min={now()}
                value={classForm.ScheduledAt}
                onChange={(e) => setClassForm({ ...classForm, ScheduledAt: e.target.value })}
              />
              <input
                className={styles.input}
                placeholder="Максимальна кількість"
                type="number"
                min="1"
                value={classForm.MaxCapacity}
                onChange={(e) => setClassForm({ ...classForm, MaxCapacity: e.target.value })}
              />
              <input
                className={styles.input}
                placeholder="Локація"
                value={classForm.Location}
                onChange={(e) => setClassForm({ ...classForm, Location: e.target.value })}
              />
              <input
                className={styles.input}
                placeholder="Опис"
                value={classForm.Description}
                onChange={(e) => setClassForm({ ...classForm, Description: e.target.value })}
              />
              <button className={styles.saveBtn} onClick={handleAddClass}>Додати</button>
            </div>
          </div>
        )}

        {classes.map((c) => (
          <div key={c.id} className={styles.card}>
            {editingClassId === c.id ? (
              <div className={styles.editForm}>
                {editError && <p style={{ color: '#e74c3c', marginBottom: '12px' }}>{editError}</p>}
                <input
                  className={styles.input}
                  value={editForm.ClassName}
                  onChange={(e) => setEditForm({ ...editForm, ClassName: e.target.value })}
                />
                <select
                  className={styles.input}
                  value={editForm.TypeId}
                  onChange={(e) => setEditForm({ ...editForm, TypeId: e.target.value })}
                >
                  <option value="">Оберіть напрям</option>
                  {classTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.typeName}</option>
                  ))}
                </select>
                <input
                  className={styles.input}
                  type="datetime-local"
                  min={now()}
                  value={editForm.ScheduledAt}
                  onChange={(e) => setEditForm({ ...editForm, ScheduledAt: e.target.value })}
                />
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  value={editForm.MaxCapacity}
                  onChange={(e) => setEditForm({ ...editForm, MaxCapacity: e.target.value })}
                />
                <input
                  className={styles.input}
                  placeholder="Локація"
                  value={editForm.Location}
                  onChange={(e) => setEditForm({ ...editForm, Location: e.target.value })}
                />
                <input
                  className={styles.input}
                  placeholder="Опис"
                  value={editForm.Description}
                  onChange={(e) => setEditForm({ ...editForm, Description: e.target.value })}
                />
                <div className={styles.cardActions}>
                  <button className={styles.saveBtn} onClick={() => handleEditClass(c.id)}>Зберегти</button>
                  <button className={styles.cancelBtn} onClick={() => setEditingClassId(null)}>Скасувати</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{c.className}</h3>
                  <p className={styles.cardMeta}>{c.type?.typeName} · {c.location}</p>
                  <p className={styles.cardMeta}>{formatDate(c.scheduledAt)}</p>
                  <p className={styles.cardDesc}>{c.description}</p>
                  <p className={styles.cardMeta}>{c.bookings?.length || 0} / {c.maxCapacity} записано</p>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.viewBtn} onClick={() => navigate(`/instructor/${instructorId}/classes/${c.id}`)}>
                    Переглянути записи
                  </button>
                  <button className={styles.editBtn} onClick={() => startEdit(c)}>Редагувати</button>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteClass(c.id)}>Видалити</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
