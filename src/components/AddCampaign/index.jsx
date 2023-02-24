import styles from "./AddCampaign.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../Button";
import { motion } from "framer-motion";

export function AddCampaign({ setOpenModal }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, type: "spring", duration: 0.5 }}
      className={styles.createCampaign}
    >
      <div className={styles.wrap}>
        <div className={styles.top}>
          <h5>Thêm chiến dịch</h5>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ cursor: "pointer", fontSize: "20px" }}
          />
        </div>
        <div className={styles.container}>
          <h6>Danh sách chiến dịch đang tham gia</h6>
          <ul>
            <li>chien dịch ab</li>
            <li>chien dịch ab</li>
            <li>chien dịch ab</li>
            <li>chien dịch ab</li>
          </ul>
          <select>
            <option value="">1</option>
          </select>
        </div>
        <div className={styles.btn_add}>
          <Button onClick={() => setOpenModal(false)}>Hủy</Button>
          <Button>Thêm</Button>
        </div>
      </div>
    </motion.div>
  );
}
