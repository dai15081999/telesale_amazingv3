import styles from './NewsBoard.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import Chart from '../../../../components/Chart';

export default function NewsBoard() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className={styles.newsboard}>
      {/* report date */}
      <div className={styles.reportDate}>
        <h5 className={styles.title}>Báo cáo ngày</h5>
        <div className={styles.dates}>
          <div>
            <DatePicker selected={startDate} />
          </div>
          <strong> Tới</strong>
          <div>
            <DatePicker selected={startDate} />
          </div>
        </div>
        <div className={styles.statistical}>
          <h4>Thống kê theo ngày: 2023-02-01 Tới ngày 2023-01-06</h4>
          <div className={styles.contents}>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>12</h2>
            </div>
          </div>
          <div className={styles.charts}>
            <div className={styles.chart}>
              <h5>
                Tổng Hóa Đơn Của Nhân Viên Từ 2023-02-15 Tới Ngày 2023-03-24.
              </h5>
              <Chart />
            </div>
          </div>
        </div>
      </div>
      {/* end report date */}
    </div>
  );
}
