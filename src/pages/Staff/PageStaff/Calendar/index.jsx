import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import styles from "./Calendar.module.css";

function Calendar() {
  return (
    <>
      <div className={styles.head__box}>
        <h3>Lịch</h3>
      </div>
      <FullCalendar
        weekends={true}
        events={[
          { title: "event 1", date: "2023-02-23" },
          { title: "event 2", date: "2019-04-02" },
        ]}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
      />
    </>
  );
}

export default Calendar;
