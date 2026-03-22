import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import API_BASE_URL from "../../config";
import styles from "./ClassDetail.module.css";
import { formatDate } from "../../utils";

const fetchClassDetail = async (classId) => {
  const res = await fetch(`${API_BASE_URL}/api/classes/detail/${classId}`);
  if (!res.ok) return null;
  return await res.json();
};

export default function ClassDetail() {
  const { instructorId, classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const [classData, setClassData] = useState(null);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const role = user?.role;
  const isInstructor = role === "Instructor";

  useEffect(() => {
    fetchClassDetail(classId).then((data) => {
      setClassData(data);
      if (data && userId) {
        const alreadyBooked = data.bookings?.some(
          (b) => b.userId === userId && b.status?.statusName !== "Cancelled",
        );
        setBooked(alreadyBooked);
      }
    });
  }, [classId, userId]);

  const handleBookingStatus = async (bookingId, action) => {
    await fetch(`${API_BASE_URL}/api/classes/bookings/${bookingId}/${action}`, {
      method: "PUT",
    });
    fetchClassDetail(classId).then(setClassData);
  };

  const handleBook = async () => {
    console.log("Sending:", { userId, classId: parseInt(classId) });
    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, classId: parseInt(classId) }),
    });

    if (res.ok) {
      setBooked(true);
      fetchClassDetail(classId).then(setClassData);
    } else {
      const text = await res.text();
      setBookingError(text);
    }
  };

  const handleCancelMyBooking = async () => {
    const myBooking = classData.bookings?.find((b) => b.userId === userId);
    if (!myBooking) return;

    await fetch(`${API_BASE_URL}/api/classes/bookings/${myBooking.id}/cancel`, {
      method: "PUT",
    });
    setBooked(false);
    fetchClassDetail(classId).then(setClassData);
  };

  const statusColor = (name) => {
    if (name === "Confirmed") return "#2ecc71";
    if (name === "Cancelled") return "#e74c3c";
    if (name === "Attended") return "#3498db";
    return "#f39c12";
  };

  const isPast = classData
    ? new Date(classData.scheduledAt) < new Date()
    : false;

 
  const spotsLeft = classData
    ? classData.maxCapacity -
      (classData.bookings?.filter(
        (b) =>
          b.status?.statusName === "Pending" ||
          b.status?.statusName === "Confirmed",
      ).length || 0)
    : 0;
  const myBooking = classData?.bookings?.find((b) => b.userId === userId);

  if (!classData) return <p>Завантаження...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back button */}
        <button
          className={styles.backBtn}
          onClick={() =>
            isInstructor
              ? navigate(`/instructor/${instructorId}`)
              : navigate("/classes")
          }
        >
          ← Назад
        </button>

        {/* Class Info */}
        <div className={styles.classInfo}>
          <p className={styles.label}>ЗАНЯТТЯ</p>
          <h1 className={styles.title}>{classData.className}</h1>
          <div className={styles.meta}>
            <span>{classData.type?.typeName}</span>
            <span>·</span>
            <span>📍 {classData.location}</span>
            <span>·</span>
            <span>
              🗓 {formatDate(classData.scheduledAt)}
            </span>
          </div>

          {/* Instructor card */}
          <div className={styles.instructorCard}>
            <div className={styles.instructorAvatar}>
              {classData.instructor?.user?.firstName?.[0]}
              {classData.instructor?.user?.surname?.[0]}
            </div>
            <div className={styles.instructorInfo}>
              <p className={styles.instructorName}>
                {classData.instructor?.user?.firstName}{" "}
                {classData.instructor?.user?.surname}
              </p>
              <p className={styles.instructorMeta}>
                {classData.instructor?.workStartDate && (
                  <>
                    Досвід:{" "}
                    {new Date().getFullYear() -
                      new Date(
                        classData.instructor.workStartDate,
                      ).getFullYear()}{" "}
                    років
                  </>
                )}
              </p>
              {classData.instructor?.bio && (
                <p className={styles.instructorBio}>
                  {classData.instructor.bio}
                </p>
              )}
            </div>
          </div>

          <p className={styles.desc}>{classData.description}</p>

          {/* USER VIEW — book button */}
          {!isInstructor && (
            <div className={styles.bookingSection}>
              {isPast ? (
                <p className={styles.pastNote}>Заняття вже відбулось.</p>
              ) : spotsLeft <= 0 && !booked ? (
                <p className={styles.fullNote}>Місць немає.</p>
              ) : booked ? (
                <div className={styles.bookedInfo}>
                  <p className={styles.bookedNote}>
                    ✓ Ви записані
                    {/* {myBooking && (
                      <span style={{ color: statusColor(myBooking.status?.statusName) }}>
                        {' '}— {myBooking.status?.statusName}
                      </span>
                    )} */}
                  </p>
                  {myBooking?.status?.statusName !== "Cancelled" && (
                    <button
                      className={styles.cancelMyBtn}
                      onClick={handleCancelMyBooking}
                    >
                      Скасувати запис
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className={styles.spotsNote}>Вільних місць: {spotsLeft}</p>
                  <button className={styles.bookBtn} onClick={handleBook}>
                    Записатись
                  </button>
                  {bookingError && (
                    <p className={styles.error}>{bookingError}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* INSTRUCTOR VIEW — bookings list */}
        {isInstructor && (
          <>
            <h2 className={styles.bookingsTitle}>
              Записи ({classData.bookings?.length || 0})
            </h2>
            {classData.bookings?.length === 0 ? (
              <p className={styles.empty}>Записів ще немає.</p>
            ) : (
              <div className={styles.bookingsList}>
                {classData.bookings.map((b) => (
                  <div key={b.id} className={styles.bookingRow}>
                    <div className={styles.bookingInfo}>
                      <span className={styles.bookingName}>
                        {b.user?.firstName} {b.user?.surname}
                      </span>
                      <span className={styles.bookingEmail}>
                        {b.user?.email}
                      </span>
                    </div>
                    <div className={styles.bookingActions}>
                      <span
                        style={{
                          color: statusColor(b.status?.statusName),
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {b.status?.statusName}
                      </span>
                      {b.status?.statusName === "Pending" && (
                        <>
                          <button
                            className={styles.confirmBtn}
                            onClick={() => handleBookingStatus(b.id, "confirm")}
                          >
                            Підтвердити
                          </button>
                          <button
                            className={styles.cancelBtn}
                            onClick={() => handleBookingStatus(b.id, "cancel")}
                          >
                            Відхилити
                          </button>
                        </>
                      )}
                      {b.status?.statusName === "Confirmed" && isPast && (
                        <button
                          className={styles.attendedBtn}
                          onClick={() => handleBookingStatus(b.id, "attend")}
                        >
                          Відмітити відвідування
                        </button>
                      )}
                      {b.status?.statusName === "Confirmed" && !isPast && (
                        <button
                          className={styles.cancelBtn}
                          onClick={() => handleBookingStatus(b.id, "cancel")}
                        >
                          Скасувати
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
