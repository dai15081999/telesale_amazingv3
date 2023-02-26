// Styles
import styles from './FormModal.module.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// Context
import { useAuth } from '../../context/AuthContext';
import { useAxios } from '../../context/AxiosContex';
// Modules
import { motion } from 'framer-motion';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

export function FormModal({ setOpenModal }) {
  //* Query client
  const queryClient = useQueryClient();
  //* Link api
  const { getSource, getChannels, getLevelUser, getcampaigns, postCustomer } =
    useAxios();
  //* Data từ context
  const { user, brand } = useAuth();

  //* Lấy tất cả levels khách
  const { data: levels } = useQuery(
    ['levels', brand],
    () => getLevelUser(brand),
    {
      enabled: !!brand,
    },
  );
  //* Lấy tất cả chiến dịch
  const { data: campaigns } = useQuery(
    ['campaigns', brand],
    () => getcampaigns(+brand),
    { enabled: !!brand },
  );
  //* Lấy source theo brand ID
  const { data: source } = useQuery(['source', brand], () => getSource(brand));
  //* Lấy kênh
  const { data: channels } = useQuery(['channels', brand], () =>
    getChannels(brand),
  );

  //* Ref data
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

  //* Mutatuion tạo khách hàng
  const postCustomerMutation = useMutation(postCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
  });
  //* Hàm tạo khách mới
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
      toast('Không được bỏ trống', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
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
    toast('Thêm khách hàng thành công', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setOpenModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className={styles.formmoal}
    >
      <form>
        <div className={styles.head}>
          <h6>Thêm khách hàng</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Tên</label>
            <Input
              ref={lnRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Họ</label>
            <Input
              ref={fnRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Số điện thoại</label>
            <Input
              ref={pnRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Địa chỉ</label>
            <Input
              ref={arRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <Input
              ref={emRef}
              type='text'
            />
          </div>
          <div className={styles.flex}>
            <div className={styles.field}>
              <label>Sex</label>
              <select ref={genderRef}>
                <option value='1'>Nam</option>
                <option value='0'>Nữ</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Birthday</label>
              <Input
                ref={bdRef}
                type='date'
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Level</label>
            <select ref={levelRef}>
              {levels &&
                levels.map((lv, index) => {
                  if (lv?.name) {
                    return (
                      <option
                        key={index}
                        value={lv.id}
                      >
                        {lv.name}
                      </option>
                    );
                  }
                })}
            </select>
          </div>
          <div className={styles.field}>
            <label>Kênh KH</label>
            <select ref={channelRef}>
              {channels &&
                channels.map((cn, index) => (
                  <option
                    key={index}
                    value={cn.id}
                  >
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
                  <option
                    key={index}
                    value={sor.id}
                  >
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
                  <option
                    key={index}
                    value={cp.id}
                  >
                    {cp.name}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.buttons}>
            <Button
              className={styles.cancelbtn}
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              className={styles.addbtn}
              onClick={handleAddUser}
            >
              Thêm khách hàng
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
