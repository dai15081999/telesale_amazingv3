// styles
import styles from './AddCampaign.module.css';
// icon
import { AiOutlineClose } from 'react-icons/ai';
// component
import { Button } from '../Button';
// modules
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAxios } from '../../context/AxiosContex';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

export function AddCampaign({ userID, campaigns, setOpenModal }) {
  const { getCustomer, postCampaignToUser } = useAxios();
  const campaignRef = useRef();
  // get customer
  const { data: customer, refetch: refetchCtm } = useQuery(
    ['cusmtomer', userID],
    () => getCustomer(userID),
    { enabled: !!userID },
  );

  const campaignToUserMutation = useMutation({
    mutationFn: (data) => {
      return postCampaignToUser(data).then((res) => {
        return res;
      });
    },
    onSuccess(data2) {
      console.log(data2);
      if (data2?.status === 'Success') {
        refetchCtm();
        toast('Tham gia chiến dịch thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    },
  });
  function addCampaignToUserHandle() {
    const dataPost = {
      dataUserId: +userID,
      campaignId: campaignRef?.current.value,
    };
    if (!campaignRef?.current.value) {
      toast('Bạn đã tham gia hết chiến dịch', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    campaignToUserMutation.mutate(dataPost);
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', duration: 0.5 }}
      className={styles.createCampaign}
    >
      <div className={styles.wrap}>
        <div className={styles.top}>
          <h5>Thêm chiến dịch</h5>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        </div>
        <div className={styles.container}>
          <h6>Danh sách chiến dịch đang tham gia</h6>
          <ul>
            {customer?.customer.campaigns.length
              ? customer?.customer.campaigns.map((cpi, index) => {
                  if (cpi.name !== null) {
                    return <li key={index}>- {cpi.name}</li>;
                  }
                })
              : 'Bạn chưa tham gia chiến dịch nào'}
          </ul>
          <select ref={campaignRef}>
            {campaigns &&
              campaigns.map((elm, index) => {
                if (
                  !customer?.customer.campaigns.find(
                    (it) => it.campaignId === elm.id,
                  )
                ) {
                  return (
                    <option
                      value={elm?.id}
                      key={index}
                    >
                      {elm?.name}
                    </option>
                  );
                }
              })}
          </select>
        </div>
        <div className={styles.btn_add}>
          <Button
            className={styles.cancelbtn}
            onClick={() => setOpenModal(false)}
          >
            Hủy
          </Button>
          <Button
            onClick={addCampaignToUserHandle}
            className={styles.addbtn}
          >
            Thêm
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
