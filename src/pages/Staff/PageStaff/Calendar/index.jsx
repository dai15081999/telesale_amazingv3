import { lazy, Suspense } from 'react';
import LoadingLazy from '../../../../components/LoadingLazy';
const FullCalendar = lazy(() => import('@fullcalendar/react'));
import styles from './Calendar.module.css';
import vi from 'date-fns/locale/vi';
import { useAxios } from '../../../../context/AxiosContex';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import multiMonthPlugin from '@fullcalendar/multimonth';

function Calendar() {
  const { getScheduleById } = useAxios();
  const { user } = useAuth();

  const { data } = useQuery(
    ['scheduleById', user?.Id],
    () => getScheduleById(user?.Id),
    {
      enabled: !!user?.Id,
    },
  );

  return (
    <>
      <div className={styles.head__box}>
        <h3>Lịch</h3>
      </div>
      <Suspense fallback={<LoadingLazy />}>
        <FullCalendar
          locale={vi}
          weekends={true}
          events={
            data &&
            data.map((elm) => {
              return { title: elm?.title, date: elm?.meetTime };
            })
          }
          plugins={[multiMonthPlugin]}
          initialView='multiMonthYear'
        />
      </Suspense>
    </>
  );
}

export default Calendar;
