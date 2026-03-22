import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import HomeHeader from "../../compomets/Header/HomeHeader";
import { useNavigate } from "react-router";
import ClassType from "../../compomets/ClassType/ClassType";
import { fetchClassTypes } from "../../api.js";
import { useAuth } from "../../Context/AuthContext";

export default function Home() {
  const [classTypes, setClassTypes] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchClassTypes().then((data) => setClassTypes(data));
  }, []);
  const getButtonConfig = () => {
    if (!user) return { text: "Обрати заняття", path: "/login" };
    if (user.role === "Admin")
      return { text: "Панель адміністратора", path: "/admin" };
    if (user.role === "Instructor")
      return { text: "Мої заняття", path: `/instructor/${user.instructorId}` };
    return { text: "Обрати заняття", path: "/classes" };
  };

  const { text, path } = getButtonConfig();

  return (
    <>
      <main className={styles.home}>
        <section className={styles.mainContainer}>
          <img
            src="../assets/img/main.jpg"
            alt="a woman doing pilates"
            className={styles.backImage}
          />
          <h1>Рух — це розмова тіла з розумом.</h1>
          <div className={styles.toAction}>
            <p>{user? user.role === "Administator" || user.role === "Admin"? "" : "Запишіться — відчуйте гармонію руху.":"Запишіться — відчуйте гармонію руху."}</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate(path)}
            >
              {text}
            </button>
          </div>
        </section>

        <section className={styles.classesContainer}>
          <h1>Тренування різних напрямів</h1>
          <div className={styles.classesGrid}>
            {classTypes.map((type) => (
              <ClassType
                key={type.id}
                name={type.typeName}
                description={type.description}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
