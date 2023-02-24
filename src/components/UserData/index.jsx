// styles
import styles from "./UserData.module.css";
// functions
import { formartDate, formatNumber } from "../../utils/functions";
// icons
import { FcCallback } from "react-icons/fc";
import { CgDetailsMore } from "react-icons/cg";
// components
import { Loading } from "../Loading";
// modules
import { useNavigate } from "react-router-dom";

export function UserData({ handleCallToUser, groupNamed, isLoading }) {
  const navigate = useNavigate();
  return (
    <>
      {isLoading ? (
        <div className={styles.loading__tb}>
          <Loading size="90" color="red" />
        </div>
      ) : (
        <>
          <div className={styles.head_new}>
            <span>STT</span>
            <span>Tên</span>
            <span>Số điện thoại</span>
            <span>Ngày tham gia</span>
            <span style={{ textAlign: "center" }}>Nhân viên quản lý</span>
            <span style={{ textAlign: "center" }}>Gọi</span>
            <span style={{ textAlign: "center" }}>Xem chi tiết</span>
          </div>
          {/* render user */}
          <div className={styles.content__xx}>
            {groupNamed
              .sort((a, b) => {
                const nameA = a.key?.toUpperCase();
                const nameB = b.key?.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              })
              .map((elm, index) => (
                <div key={index}>
                  <h5>{elm.key}</h5>
                  {elm.value.map((rl, index) => (
                    <div key={index} className={styles.content_new}>
                      <span style={{ color: "grey" }}>{index + 1}</span>
                      <span>{rl.lastName}</span>
                      <span>{formatNumber(rl.phoneNumber)}</span>
                      <span>{formartDate(rl.dateCreated, "full")}</span>
                      <span style={{ textAlign: "center" }}>{rl.userName}</span>
                      <span
                        className={styles.call}
                        style={{ cursor: "pointer" }}
                      >
                        <FcCallback
                          onClick={() =>
                            handleCallToUser({
                              number: rl?.phoneNumber,
                              id: rl?.id,
                            })
                          }
                          className={styles.btn__C}
                          style={{ fontSize: "20px" }}
                        />
                      </span>
                      <span
                        className={styles.call}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/staff/${rl.id}`)}
                      >
                        <CgDetailsMore
                          className={styles.btn__C}
                          style={{ fontSize: "20px" }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
}
