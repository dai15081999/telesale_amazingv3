// Styles
import styles from './Campaign.module.css';
// Icons
// Context
import { useAuth } from '../../../../context/AuthContext';
import { useAxios } from '../../../../context/AxiosContex';
// Modules
import { useQuery } from '@tanstack/react-query';
// Functions
import { userNamegroup } from '../../../../utils/functions';
// functions
import { formartDate, formatNumber } from '../../../../utils/functions';
// icons
import { AiOutlinePlus } from 'react-icons/ai';
import { CgDetailsMore } from 'react-icons/cg';
// components
import { AddCampaign } from '../../../../components/AddCampaign';
import { Loading } from '../../../../components/Loading';
// modules
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Capaign() {
  // navigate
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [campaignId, setCampaignId] = useState();
  const [userID, setUserID] = useState();

  // sort data name
  const groupName = [];
  const groupNamed = [];
  // Apis link
  const {
    getSource,
    getChannels,
    getLevelUser,
    getCustomersStaff,
    getcampaigns,
    getCustomersByCapaignId,
  } = useAxios();
  // data from authcontext
  const { user, brand } = useAuth();
  // get levels users
  const { data: levels } = useQuery(['levels', brand], () =>
    getLevelUser(brand),
  );
  // get customers
  const { data: customers, isLoading } = useQuery(
    ['customers', brand, user?.UserName],
    () => getCustomersStaff({ brandId: +brand, name: user?.UserName }),
    {
      enabled: !!brand,
    },
  );

  const { data: ctm } = useQuery(
    ['ctm', campaignId],
    () => getCustomersByCapaignId(+campaignId),
    {
      enabled: !!campaignId,
    },
  );
  // get capaigns
  const { data: campaigns } = useQuery(
    ['campaigns', brand],
    () => getcampaigns(+brand),
    { enabled: !!brand },
  );

  // get source
  const { data: source } = useQuery(['source', brand], () => getSource(brand));
  // get channels
  const { data: channels } = useQuery(['channels', brand], () =>
    getChannels(brand),
  );
  //* Get campaign by id

  // ******* //
  // sort group name data
  customers?.forEach((elm) => {
    if (elm.firstName) {
      if (ctm) {
        ctm?.forEach((ctmelm) => {
          if (elm.id === ctmelm.id) {
            groupName.push(elm);
          }
        });
      } else {
        groupName.push(elm);
      }
    }
  });

  userNamegroup(groupName)?.forEach((value, index) => {
    groupNamed.push({ key: index, value });
  });
  // ******* //
  function openModaladdCampaign() {
    setOpenModal(true);
  }

  return (
    <>
      {openModal && (
        <AddCampaign
          userID={userID}
          campaigns={campaigns}
          setOpenModal={setOpenModal}
        />
      )}
      <div className={styles.campaign}>
        <span>Chiến dịch: </span>
        <select onChange={(e) => setCampaignId(e.target.value)}>
          <option value=''>Tất cả chiến dịch</option>
          {campaigns &&
            campaigns.map((elm, index) => (
              <option
                key={index}
                value={elm.id}
              >
                {elm.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.box__content}>
        <div className={styles.head__box}>
          <h3>Chiến dịch</h3>
        </div>

        <div className={styles.content}>
          {/* Level khách hàng */}
          <div className={styles.selects}>
            <div>
              <h5>Level khách hàng:</h5>
              <select>
                {levels &&
                  levels.map((elm, index) => {
                    if (elm?.name) {
                      return (
                        <option
                          key={index}
                          value={elm.brandID}
                        >
                          {elm.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
            {/* Kênh khách hàng */}
            <div>
              <h5>Kênh khách hàng:</h5>
              <select>
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

            <div>
              <h5>Nguồn khách hàng:</h5>
              <select>
                {source &&
                  source.map((sr, index) => {
                    if (sr?.name) {
                      return (
                        <option
                          key={index}
                          value={sr.id}
                        >
                          {sr.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
          </div>
          <div className={styles.select__btn}>
            <button className={`${styles.btn} ${styles.btn__filter}`}>
              Lọc
            </button>
          </div>
          {/* Data user */}
          <div className={styles.table}>
            {isLoading ? (
              <div className={styles.loading__tb}>
                <Loading
                  size='90'
                  color='red'
                />
              </div>
            ) : (
              <>
                <div className={styles.head_new}>
                  <span className={styles.col1}>STT</span>
                  <span>Tên</span>
                  <span>Số điện thoại</span>
                  <span className={styles.col2}>Ngày tham gia</span>
                  <span
                    className={styles.col3}
                    style={{ textAlign: 'center' }}
                  >
                    Nhân viên quản lý
                  </span>
                  <span style={{ textAlign: 'center' }}>Thêm chiến dịch</span>
                  <span style={{ textAlign: 'center' }}>Xem chi tiết</span>
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
                          <div
                            key={index}
                            className={styles.content_new}
                          >
                            <span
                              className={styles.col1}
                              style={{ color: 'grey' }}
                            >
                              {index + 1}
                            </span>
                            <span>{rl.lastName}</span>
                            <span>{formatNumber(rl.phoneNumber)}</span>
                            <span className={styles.col2}>
                              {formartDate(rl.dateCreated, 'full')}
                            </span>
                            <span
                              className={styles.col3}
                              style={{ textAlign: 'center' }}
                            >
                              {rl.userName}
                            </span>
                            <span
                              onClick={openModaladdCampaign}
                              className={styles.call}
                              style={{ cursor: 'pointer' }}
                            >
                              <AiOutlinePlus
                                onClick={() => setUserID(rl.id)}
                                className={styles.btn__C}
                                style={{ fontSize: '20px' }}
                              />
                            </span>
                            <span
                              className={styles.call}
                              style={{ cursor: 'pointer' }}
                              onClick={() => navigate(`/staff/${rl.id}`)}
                            >
                              <CgDetailsMore
                                className={styles.btn__C}
                                style={{ fontSize: '20px' }}
                              />
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
