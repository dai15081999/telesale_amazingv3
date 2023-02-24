import styles from "./Brand.module.css";
import { Button } from "../../components/Button";
import { useAxios } from "../../context/AxiosContex";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { Navigate } from "react-router-dom";

export default function Brand() {
  const { getBrands } = useAxios();
  const { brand, setBrand, user } = useAuth();
  const brandRef = useRef();

  const { data } = useQuery(["brands"], getBrands);
  if (brand) {
    return <Navigate to="staff" />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  function nextPage() {
    setBrand(brandRef.current.value);
  }
  return (
    <div className={styles.brand}>
      <div className={styles.wrap}>
        <h4>Chọn thương hiệu</h4>
        <select ref={brandRef}>
          {data &&
            data.map((elm, index) => (
              <option key={index} value={elm.id}>
                {elm.name}
              </option>
            ))}
        </select>
        <Button onClick={nextPage} className={styles.button}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
