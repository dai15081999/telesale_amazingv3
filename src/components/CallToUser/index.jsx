// styles
import styles from './CallToUser.module.css';
// Components
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// Modules
import { motion } from 'framer-motion';
import { useAxios } from '../../context/AxiosContex';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
// context
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSip } from '../../context/SipContext';
// functions
import {
  formatNumber,
  toHoursAndMinutes,
  truncate,
} from '../../utils/functions';

export function CallToUser({ user, setOpenFormCall }) {
  //* Khác
  const navigate = useNavigate();
  //* API Link
  const { getLevelUser, saveHistoryCalled } = useAxios();
  //* Dữ liệu từ socket
  const { brand, dataAfterParse, setDataCalled, setDataAfterParse } = useAuth();
  //* Trạng thái gọi
  const { rejectStt, deviceclv, setRejectStt } = useSip();

  //* Lấy level theo brand
  const { data: levels } = useQuery(
    ['levels', brand],
    () => getLevelUser(brand),
    { enabled: !!brand },
  );

  //* Tắt cuộc gọi
  function rejectCall() {
    deviceclv?.current.reject();
    toast('Cuộc gọi đã kết thúc', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  //* Hủy, quay về
  function cancelCall() {
    setRejectStt();
    setDataCalled(null);
    setDataAfterParse(null);
    setOpenFormCall(false);
    deviceclv?.current.reject();
  }
  //* Mutation lưu lịch sử gọi
  const saveHistory = useMutation({
    mutationFn: (data) => {
      return saveHistoryCalled(data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSuccess() {
      setRejectStt(null);
      setDataAfterParse(null);
      setDataCalled(null);
      setOpenFormCall(false);
      toast('Lưu thành công', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    },
  });
  
  //* Ref thông tin cuộc gọi
  const status = useRef();
  const linkFile = useRef();
  const noteRef = useRef();
  const levelIdRef = useRef();
  //* Hàm lưu cuộc gọi
  function saveCalled() {
    const dataPost = {
      callNumber: dataAfterParse?.CallName || '',
      receiptNumber: dataAfterParse?.ReceiptNumber || '',
      keyRinging: dataAfterParse?.KeyRinging || '',
      dateCall: Date.now(),
      message: 'test',
      status: status.current.value || '',
      totalTiemCall: +dataAfterParse?.Data?.TotalTimeCall || 0,
      realTimeCall: +dataAfterParse?.Data?.RealTimeCall || 0,
      linkFile: linkFile.current.value || '',
      typeCall: dataAfterParse?.Direction || '',
      dataUserId: +user?.customer.dataUsers.id || '',
      userId: +user?.customer.dataUsers.userId || '',
      note: noteRef.current.value || '',
      levelId: +levelIdRef.current.value,
      rating: 5,
      orderCode: '',
      campaignId: 0,
    };
    saveHistory.mutate(dataPost);
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring' }}
        className={styles.formmoal}
      >
        <div className={styles.wrapf}>
          <div className={styles.form}>
            <div className={styles.head}>
              <h6>Thông tin cuộc gọi</h6>
            </div>
            <div className={styles.fields}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                <span>
                  Tên khách hàng:{' '}
                  {user?.customer.dataUsers.firstName +
                    ' ' +
                    user?.customer.dataUsers.lastName}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                <span>
                  Số điện thoại:{' '}
                  {dataAfterParse?.ReceiptNumber
                    ? formatNumber(dataAfterParse?.ReceiptNumber)
                    : ''}
                </span>
              </div>
              <div className={styles.field}>
                <label>Thời gian gọi</label>
                <Input
                  disabled
                  value={
                    dataAfterParse?.Data?.TotalTimeCall
                      ? toHoursAndMinutes(dataAfterParse?.Data?.TotalTimeCall)
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Trạng thái gọi</label>
                <Input
                  disabled
                  ref={status}
                  value={
                    dataAfterParse
                      ? dataAfterParse?.Status === 'Up_Out'
                        ? 'Đang nói chuyện'
                        : dataAfterParse?.Status === 'Down_Out'
                        ? 'Đã tắt máy'
                        : rejectStt === 11
                        ? 'Khách hàng bận'
                        : rejectStt === 12
                        ? 'Tự hủy'
                        : 'Đang đổ chuông'
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Thực gọi</label>
                <Input
                  disabled
                  value={
                    dataAfterParse?.Data?.RealTimeCall
                      ? toHoursAndMinutes(dataAfterParse?.Data?.RealTimeCall)
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>LinkFile</label>
                <Input
                  ref={linkFile}
                  disabled
                  value={
                    dataAfterParse?.Data?.LinkFile
                      ? truncate(dataAfterParse?.Data?.LinkFile, 7, 7, 30)
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Code</label>
                <Input
                  disabled
                  value={dataAfterParse?.ApiKey ? dataAfterParse?.ApiKey : ''}
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Thông tin gọi</label>
                <textarea ref={noteRef}></textarea>
              </div>
              <div className={styles.order}>
                <div className={styles.field}>
                  <label>Level khách hàng</label>
                  <select ref={levelIdRef}>
                    {levels &&
                      levels?.map((lv, i) => (
                        <option
                          key={i}
                          value={lv.id}
                        >
                          {lv.name}
                        </option>
                      ))}
                  </select>
                </div>
                <Button
                  onClick={() =>
                    navigate(`/staff/${user?.customer.dataUsers.id}/order`)
                  }
                  className={styles.btn__calto}
                >
                  Đặt hàng
                </Button>
                <Button
                  className={styles.btn__calto}
                  onClick={rejectCall}
                >
                  Tắt máy
                </Button>
                <Button
                  className={styles.btn__calto}
                  onClick={saveCalled}
                >
                  Lưu
                </Button>
                <Button
                  className={styles.btn__calto}
                  onClick={cancelCall}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
