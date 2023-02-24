// Styles
import styles from "./FormModal.module.css";
// Icons
import { AiOutlineClose } from "react-icons/ai";
// Components
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
// Context
import { useAuth } from "../../context/AuthContext";
import { useAxios } from "../../context/AxiosContex";
// Modules
import { motion } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRef } from "react";

export function FormModal({ setOpenModal }) {
  const queryClient = useQueryClient();
  //Apis link

  const { getSource, getChannels, getLevelUser, getcampaigns, postCustomer } =
    useAxios();
  // Data from context
  const { user, brand } = useAuth();

  // get levels
  const { data: levels } = useQuery(
    ["levels", brand],
    () => getLevelUser(brand),
    {
      enabled: !!brand,
    },
  );
  // get campaigns
  const { data: campaigns } = useQuery(["campaigns"], getcampaigns);
  // get source
  const { data: source } = useQuery(["source", brand], () => getSource(brand));
  // get channels
  const { data: channels } = useQuery(["channels", brand], () =>
    getChannels(brand),
  );

  // Ref data
  const fnRef = useRef();
  const lnRef = useRef();
  const pnRef = useRef();
  const emRef = useRef();
  const arRef = useRef();
  const bdRef = useRef();
  const genderRef = useRef();
  const levelRef = useRef();
  const channelRef = useRef();
  const sourceRef = useRef();
  const capaignRef = useRef();

  // Post mutation
  const postCustomerMutation = useMutation(postCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    },
  });
  // Post user function
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !fnRef.current.value ||
      !lnRef.current.value ||
      !pnRef.current.value ||
      !emRef.current.value ||
      !arRef.current.value ||
      !bdRef.current.value ||
      !genderRef.current.value ||
      !levelRef.current.value ||
      !channelRef.current.value ||
      !sourceRef.current.value ||
      !capaignRef.current.value
    ) {
      toast.error("KhÔng được bỏ trống mục nào");
      return;
    }
    const data = {
      firstName: fnRef.current?.value,
      lastName: lnRef.current?.value,
      phoneNumber: pnRef.current?.value,
      email: emRef.current?.value,
      address: arRef.current?.value,
      dayOfBith: bdRef.current?.value,
      gender: +genderRef.current?.value,
      status: 0,
      channelId: +channelRef.current?.value,
      levelId: +levelRef.current?.value,
      userId: +user.Id,
      sourceDataId: +sourceRef.current?.value,
    };

    await postCustomerMutation.mutateAsync({
      data,
      CampaignId: capaignRef.current.value,
    });
    toast.success("Thêm khách hàng thành công");
    setOpenModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", duration: 1 }}
      className={styles.formmoal}
    >
      <form>
        <div className={styles.head}>
          <h6>Thêm khách hàng</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: "grey", fontSize: "20px", cursor: "pointer" }}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Tên</label>
            <Input ref={lnRef} type="text" />
          </div>
          <div className={styles.field}>
            <label>Họ</label>
            <Input ref={fnRef} type="text" />
          </div>
          <div className={styles.field}>
            <label>Số điện thoại</label>
            <Input ref={pnRef} type="text" />
          </div>
          <div className={styles.field}>
            <label>Địa chỉ</label>
            <Input ref={arRef} type="text" />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <Input ref={emRef} type="text" />
          </div>
          <div className={styles.flex}>
            <div className={styles.field}>
              <label>Sex</label>
              <select ref={genderRef}>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Birthday</label>
              <Input ref={bdRef} type="date" />
            </div>
          </div>
          <div className={styles.field}>
            <label>Level</label>
            <select ref={levelRef}>
              {levels &&
                levels.map((lv, index) => (
                  <option key={index} value={lv.id}>
                    {lv.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Kênh KH</label>
            <select ref={channelRef}>
              {channels &&
                channels.map((cn, index) => (
                  <option key={index} value={cn.id}>
                    {cn.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Nguồn KH</label>
            <select ref={sourceRef}>
              {source &&
                source.map((sor, index) => (
                  <option key={index} value={sor.id}>
                    {sor.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Chiến dịch</label>
            <select ref={capaignRef}>
              {campaigns &&
                campaigns.map((cp, index) => (
                  <option key={index} value={cp.id}>
                    {cp.name}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.buttons}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(false);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAddUser}>Thêm khách hàng</Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
