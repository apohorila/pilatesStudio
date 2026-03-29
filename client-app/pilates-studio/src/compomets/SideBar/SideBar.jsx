import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function SideBar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.sidebarContent}>
          <p className={styles.sidebarLabel}>МІЙ КАБІНЕТ</p>

          <nav className={styles.sidebarNav}>
            <NavLink to="/classes" className={styles.sidebarLink} onClick={onClose}>
              <span className={styles.icon}>🗓</span>
              Всі заняття
            </NavLink>
            <NavLink to="/dashboard/bookings" className={styles.sidebarLink} onClick={onClose}>
              <span className={styles.icon}>📋</span>
              Мої записи
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}