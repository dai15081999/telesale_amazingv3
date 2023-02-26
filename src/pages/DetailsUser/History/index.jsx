import styles from './History.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAxios } from '../../../context/AxiosContex';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  formartDate,
  formatMoney,
  toHoursAndMinutes,
} from '../../../utils/functions';
import { useAuth } from '../../../context/AuthContext';

export function History() {
  const [tab, setTab] = useState(false);
  const [tab2, setTab2] = useState(false);
  const { getOrderById, getHistoriesById } = useAxios();
  const { id } = useParams();
  const { brand } = useAuth();

  const { data: historyOrder } = useQuery(
    ['getorderId', id],
    () => getOrderById(+id),
    { enabled: !!id },
  );
  const { data: historyCall } = useQuery(
    ['gethtrcall', id, brand],
    () => getHistoriesById({ brand: brand, id: id }),
    { enabled: !!id },
  );
  console.log(historyCall);
  const variants = {
    open: { height: '300px' },
    closed: { height: 0 },
  };

  return (
    <div className={styles.history_details}>
      <div className={styles.htr_order}>
        <div
          onClick={() => setTab((tab) => !tab)}
          className={styles.head_detail}
        >
          <h6>Lịch sử hóa đơn - Tổng: {historyOrder?.length || 0}</h6>
        </div>
        <motion.div
          animate={tab ? 'open' : 'closed'}
          variants={variants}
          className={styles.all_order}
        >
          {historyOrder
            ? historyOrder.map((elm, index) => {
                if (elm?.product.length) {
                  return (
                    <div
                      key={index}
                      className={styles.content_dt}
                    >
                      <h5>
                        Mua ngày {formartDate(elm?.order.dateCreated, 'short')}
                      </h5>
                      <span>Mã đơn hàng: {elm?.order.code}</span>
                      <table>
                        <thead>
                          <tr>
                            <th>Sản phẩm/Dịch vụ</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {elm?.product.map((prd, index) => (
                            <tr key={index}>
                              <td>{prd.productName ? prd.productName : ''}</td>
                              <td>{prd.quantity}</td>
                              <td>{formatMoney(prd.price)}</td>
                              <td>{formatMoney(prd.price * prd.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className={styles.total_price}>
                        <h5>
                          Tổng hóa đơn:{' '}
                          <strong>{formatMoney(elm?.order.amount)}</strong>
                        </h5>
                      </div>
                    </div>
                  );
                }
              })
            : null}
        </motion.div>
      </div>
      <div className={styles.callphone}>
        <div
          onClick={() => setTab2((tab2) => !tab2)}
          className={styles.head_detail}
        >
          <h6>Ghi chú cuộc gọi - Tổng: {historyCall ? historyCall?.length : 0}</h6>
        </div>
        <motion.div
          animate={tab2 ? 'open' : 'closed'}
          variants={variants}
          className={styles.all__history}
        >
          {historyCall &&
            historyCall.map((htr, index) => (
              <div
                key={index}
                className={styles.historyCall}
              >
                <h5>Nội dung: {htr?.note ? htr?.note : 'Không có'}</h5>
                <h6 className={styles.date__history}>
                  - Vào lúc: {formartDate(htr?.dateCall, 'full')} | Amazingtech
                </h6>
                <p className={styles.status_history}>
                  Trạng thái:{' '}
                  <span>{htr?.status ? htr?.status : 'Không có'}</span>
                </p>
                <p className={styles.total__time}>
                  Tổng thời gian: {toHoursAndMinutes(htr?.totalTiemCall)}{' '}
                </p>
                <div className={styles.file__record}>
                  <span className={styles.file_title}>File ghi âm:</span>
                  {htr?.linkFile ? (
                    <audio controls>
                      <source
                        src={htr?.linkFile}
                        type='audio/wav'
                      />
                    </audio>
                  ) : (
                    'Không có'
                  )}
                </div>
              </div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
