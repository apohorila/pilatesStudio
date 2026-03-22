import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { fetchClassTypes } from "../../../api";
import styles from "./Admin.module.css";
import API_BASE_URL from "../../../config";

const fetchInstructors = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/instructors`);
    if (!res.ok) throw new Error("Failed to fetch instructors");
    return await res.json();
  } catch (error) {
    console.error("Error fetching instructors:", error);
  }
};

export default function Admin() {
  const navigate = useNavigate()
  const [classTypes, setClassTypes] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingInstructorId, setEditingInstructorId] = useState(null);

  const [classTypeForm, setClassTypeForm] = useState({
    TypeName: "",
    Description: "",
  });
  const [instructorForm, setInstructorForm] = useState({
    FirstName: "",
    Surname: "",
    Email: "",
    Password: "",
    Bio: "",
    WorkStartDate: "",
  });

  useEffect(() => {
    fetchClassTypes().then((data) => {
      if (data) setClassTypes(data);
    });
    fetchInstructors().then((data) => {
      if (data) setInstructors(data);
    });
  }, []);

  // CLASS TYPE HANDLERS
  const handleAddClassType = async () => {
    const res = await fetch(`${API_BASE_URL}/api/classtypes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classTypeForm),
    });
    if (res.ok) {
      fetchClassTypes().then((data) => {
        if (data) setClassTypes(data);
      });
      setClassTypeForm({ TypeName: "", Description: "" });
      setShowClassForm(false);
    }
  };

  const handleDeleteClassType = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/classtypes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setClassTypes(classTypes.filter((ct) => ct.id !== id));
  };

  const handleEditClassType = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/classtypes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...classTypeForm, id }),
    });
    if (res.ok) {
      fetchClassTypes().then((data) => {
        if (data) setClassTypes(data);
      });
      setEditingClassId(null);
      setClassTypeForm({ TypeName: "", Description: "" });
    }
  };

  const startEditClass = (ct) => {
    setEditingClassId(ct.id);
    setClassTypeForm({ TypeName: ct.typeName, Description: ct.description });
    setShowClassForm(false);
  };

  // INSTRUCTOR HANDLERS
  const handleAddInstructor = async () => {
    const res = await fetch(`${API_BASE_URL}/api/instructors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorForm),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error:", errorText);
      return;
    }

    fetchInstructors().then((data) => {
      if (data) setInstructors(data);
    });
    setInstructorForm({
      FirstName: "",
      Surname: "",
      Email: "",
      Password: "",
      Bio: "",
      WorkStartDate: "",
    });
    setShowInstructorForm(false);
  };

  const handleDeleteInstructor = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/instructors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setInstructors(instructors.filter((i) => i.id !== id));
  };

  const handleEditInstructor = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/instructors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorForm),
    });
    if (res.ok) {
      fetchInstructors().then((data) => {
        if (data) setInstructors(data);
      });
      setEditingInstructorId(null);
      setInstructorForm({
        FirstName: "",
        Surname: "",
        Email: "",
        Password: "",
        Bio: "",
        WorkStartDate: "",
      });
    }
  };

  const startEditInstructor = (i) => {
    setEditingInstructorId(i.id);
    setInstructorForm({
      FirstName: i.user?.firstName || "",
      Surname: i.user?.surname || "",
      Email: i.user?.email || "",
      Password: "",
      Bio: i.bio || "",
      WorkStartDate: i.workStartDate || "",
    });
    setShowInstructorForm(false);
  };

  const yearsOfExperience = (startDate) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── CLASS TYPES SECTION ─── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Напрями тренувань</h1>
            <p className={styles.subtitle}>
              Керуйте напрямами тренувань студії. Додавайте, видаляйте та
              редагуйте.
            </p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => {
              setShowClassForm(!showClassForm);
              setEditingClassId(null);
            }}
          >
            {showClassForm ? "✕ Скасувати" : "+ Новий напрям"}
          </button>
        </div>

        {showClassForm && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>Новий напрям</h3>
            <div cl={styles.formRow}>
              <input
                className={styles.input}
                placeholder="Напрям"
                value={classTypeForm.TypeName}
                onChange={(e) =>
                  setClassTypeForm({
                    ...classTypeForm,
                    TypeName: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Опис"
                value={classTypeForm.Description}
                onChange={(e) =>
                  setClassTypeForm({
                    ...classTypeForm,
                    Description: e.target.value,
                  })
                }
              />
              <button className={styles.saveBtn} onClick={handleAddClassType}>
                Додати
              </button>
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {classTypes.map((ct) => (
            <div key={ct.id} className={styles.card}>
              {editingClassId === ct.id ? (
                <div className={styles.editForm}>
                  <input
                    className={styles.input}
                    value={classTypeForm.TypeName}
                    onChange={(e) =>
                      setClassTypeForm({
                        ...classTypeForm,
                        TypeName: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    value={classTypeForm.Description}
                    onChange={(e) =>
                      setClassTypeForm({
                        ...classTypeForm,
                        Description: e.target.value,
                      })
                    }
                  />
                  <div className={styles.cardActions}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleEditClassType(ct.id)}
                    >
                      Зберегти
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setEditingClassId(null)}
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{ct.typeName}</h3>
                    <p className={styles.cardDesc}>
                      {ct.description || "Без опису"}
                    </p>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => startEditClass(ct)}
                    >
                      Редагуати
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteClassType(ct.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ─── DIVIDER ─── */}
        <div className={styles.divider} />

        {/* ─── INSTRUCTORS SECTION ─── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Тренери</h1>
            <p className={styles.subtitle}>Керуйте тренерами студії.</p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => {
              setShowInstructorForm(!showInstructorForm);
              setEditingInstructorId(null);
            }}
          >
            {showInstructorForm ? "✕ Скасувати" : "+ Додати тренера"}
          </button>
        </div>

        {showInstructorForm && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>Новий тренер</h3>
            <div className={styles.formRow}>
              <input
                className={styles.input}
                placeholder="Ім'я"
                value={instructorForm.FirstName}
                onChange={(e) =>
                  setInstructorForm({
                    ...instructorForm,
                    FirstName: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Прізвище"
                value={instructorForm.Surname}
                onChange={(e) =>
                  setInstructorForm({
                    ...instructorForm,
                    Surname: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Email"
                value={instructorForm.Email}
                onChange={(e) =>
                  setInstructorForm({
                    ...instructorForm,
                    Email: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Тимчасовий пароль"
                type="password"
                value={instructorForm.Password}
                onChange={(e) =>
                  setInstructorForm({
                    ...instructorForm,
                    Password: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Біо"
                value={instructorForm.Bio}
                onChange={(e) =>
                  setInstructorForm({ ...instructorForm, Bio: e.target.value })
                }
              />
              <input
                className={styles.input}
                placeholder="Початок роботи"
                type="date"
                value={instructorForm.WorkStartDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) =>
                  setInstructorForm({
                    ...instructorForm,
                    WorkStartDate: e.target.value,
                  })
                }
              />

              <button className={styles.saveBtn} onClick={handleAddInstructor}>
                Add
              </button>
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {instructors.map((i) => (
            <div key={i.id} className={styles.card}>
              {editingInstructorId === i.id ? (
                <div className={styles.editForm}>
                  <input
                    className={styles.input}
                    value={instructorForm.FirstName}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        FirstName: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    value={instructorForm.Surname}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        Surname: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    value={instructorForm.Email}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        Email: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    placeholder="New Password (leave blank to keep)"
                    type="password"
                    value={instructorForm.Password}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        Password: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    value={instructorForm.Bio}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        Bio: e.target.value,
                      })
                    }
                  />
                  <input
                    className={styles.input}
                    type="date"
                    value={instructorForm.WorkStartDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        WorkStartDate: e.target.value,
                      })
                    }
                  />
                  <div className={styles.cardActions}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleEditInstructor(i.id)}
                    >
                      Зберегти
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setEditingInstructorId(null)}
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {i.user?.firstName} {i.user?.surname}
                    </h3>
                    <p className={styles.cardMeta}>{i.user?.email}</p>
                    <p className={styles.cardDesc}>{i.bio || "Без біо"}</p>
                    {i.workStartDate && (
                      <p className={styles.cardMeta}>
                        Досвід: {yearsOfExperience(i.workStartDate)} роки(-ів)
                      </p>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => startEditInstructor(i)}
                    >
                      Редагувати
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteInstructor(i.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        className={styles.addBtn}
        onClick={() => navigate("/admin/charts")}
      >
        📊 Статистика
      </button>
    </div>
  );
}
