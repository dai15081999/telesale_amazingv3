import styles from './Schedule.module.css';
import { useParams } from 'react-router-dom';
import { useAxios } from '../../../context/AxiosContex';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useState, useRef } from 'react';
import vi from 'date-fns/locale/vi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Schedule() {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  let handleColor = (time) => {
    return time.getHours() > 12 ? 'text-success' : 'text-error';
  };

  const { id } = useParams();
  const { brand } = useAuth();
  const { getCustomer, getAllstore, postSchedule } = useAxios();
  // get customer
  const { data: customer } = useQuery(['customer', id], () => getCustomer(id), {
    enabled: !!id,
  });
  // get store
  const { data: store } = useQuery(['store', brand], () => getAllstore(brand), {
    enabled: !!brand,
  });

  //data ref
  const titleRef = useRef();
  const noteRef = useRef();
  const storeRef = useRef();

  const postScheduleMutation = useMutation({
    mutationFn: (data) => {
      return postSchedule(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data.status === 'Success') {
        toast('Đặt lịch thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        navigate(`/staff/${id}`);
      }
    },
  });

  function handlePostSchedule() {
    // data
    const dataPost = {
      title: titleRef.current?.value,
      status: 1,
      meetTime: startDate,
      userId: customer?.customer.dataUsers.userId,
      note: noteRef.current?.value,
      dataUserId: id,
      storeId: storeRef.current?.value,
    };
    if (
      !dataPost['title'] ||
      !dataPost['status'] ||
      !dataPost['meetTime'] ||
      !dataPost['userId'] ||
      !dataPost['note'] ||
      !dataPost['dataUserId'] ||
      !dataPost['storeId']
    ) {
      return toast('Không được bỏ trống', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
    postScheduleMutation.mutate(dataPost);
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.appointment}>
          <div className={styles.xvl}>
            <h5>Lịch</h5>
            <div className={styles.input__field}>
              <div className={styles.field}>
                <label>Nhân viên</label>
                <input
                  value={customer?.customer.dataUsers.userName}
                  disabled
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Thông tin</label>
                <input
                  ref={titleRef}
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Tên khách hàng</label>
                <input
                  value={
                    customer?.customer.dataUsers.firstName +
                    ' ' +
                    customer?.customer.dataUsers.lastName
                  }
                  disabled
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Số điện thoại</label>
                <input
                  value={customer?.customer.dataUsers.phoneNumber}
                  disabled
                  type='text'
                />
              </div>
              <div className={styles.fieldx}>
                <div>
                  <label>Ngày giờ hẹn</label>
                  <DatePicker
                    locale={vi}
                    showTimeSelect
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    timeClassName={handleColor}
                  />
                </div>
                <div>
                  <label>Chi nhánh muốn đến</label>

                  <select ref={storeRef}>
                    <option value=''>Chọn chi nhánh</option>
                    {store &&
                      store.map((elm) => (
                        <option
                          key={elm?.id}
                          value={elm?.id}
                        >
                          {elm?.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>Ghi chú</label>
                <textarea
                  ref={noteRef}
                  cols='30'
                  rows='10'
                ></textarea>
              </div>
            </div>
            <div className={styles.buttons}>
              <button
                onClick={() => navigate(`/staff/${id}`)}
                style={{ background: 'rgb(249, 44, 78)' }}
              >
                Quay về
              </button>
              <button
                style={{ background: '#1775f1' }}
                onClick={handlePostSchedule}
              >
                Đặt lịch
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
