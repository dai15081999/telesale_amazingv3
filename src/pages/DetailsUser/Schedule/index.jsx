import styles from "./Schedule.module.css";
import { useParams } from "react-router-dom";
import { useAxios } from "../../../context/AxiosContex";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";

export default function Schedule() {
  const { id } = useParams();
  const { brand } = useAuth();
  const { getCustomer, getAllstore } = useAxios();
  // get customer
  const { data: customer } = useQuery(["customer", id], () => getCustomer(id), {
    enabled: !!id,
  });
  // get store
  const { data: store } = useQuery(["store", brand], () => getAllstore(brand), {
    enabled: !!brand,
  });
  console.log(store);
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
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <label>Thông tin</label>
                <input type="text" />
              </div>
              <div className={styles.field}>
                <label>Tên khách hàng</label>
                <input
                  value={
                    customer?.customer.dataUsers.firstName +
                    " " +
                    customer?.customer.dataUsers.lastName
                  }
                  disabled
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <label>Số điện thoại</label>
                <input
                  value={customer?.customer.dataUsers.phoneNumber}
                  disabled
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <div>
                  <label>Ngày giờ hẹn</label>
                  <input type="date" />
                </div>
                <div>
                  <label>Chi nhánh muốn đến</label>
                  <select>
                    {store &&
                      store.map((elm) => (
                        <option key={elm?.id} value={elm?.id}>
                          {elm?.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>Ghi chú</label>
                <textarea cols="30" rows="10"></textarea>
              </div>
            </div>
            <div className={styles.buttons}>
              <button style={{ background: "rgb(249, 44, 78)" }}>
                Quay về
              </button>
              <button>Đặt lịch</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
