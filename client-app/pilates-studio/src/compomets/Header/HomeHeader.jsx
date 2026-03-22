import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./HomeHeader.module.css";
import { useAuth } from '../../Context/AuthContext';

export default function HomeHeader({ onMenuOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navBar}>
      <NavLink to="/" className={styles.logo}>Svidomo</NavLink>
      <div className={styles.navRight}>
        {user && <span className={styles.userName}>Привіт, {user.firstName}!</span>}
        <button
          className={styles.navButton}
          onClick={user ? handleLogout : () => navigate('/login')}
        >
          {user ? 'Вийти' : 'Увійти'}
        </button>
        {user ? onMenuOpen && (
          <button className={styles.hamburger} onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        ): null}
      </div>
    </nav>
  );
}