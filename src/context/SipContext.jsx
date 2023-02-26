// modules
import { createContext, useContext, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clvDevice } from 'telesale';
import { useQuery, useMutation } from '@tanstack/react-query';
// Contexts
import { useAuth } from './AuthContext';
import { useAxios } from './AxiosContex';

const Context = createContext();
export function useSip() {
  return useContext(Context);
}

export function SipProvider({ children }) {
  const [rejectStt, setRejectStt] = useState();
  const deviceclv = useRef(null);
  //! config sipjs
  let config = {
    host: 'cf-pbx0001442.cfvn.cloud',
    port: '4433',
    displayName: `106`,
    username: `106`,
    password: `Zaq@1234`,
    wsServers: 'wss://rtc.cloudfone.vn:4433',
  };
  //! Theo giõi thay đổi
  useEffect(() => {
    const device = new clvDevice(config);
    device.on('connecting', () => {
      console.log('connecting!');
    });
    device.on('accepted', (data) => {
      console.log(data);
      setRejectStt(9);
    });
    device.on('invite', (data) => {
      console.log('new data', data);
    });
    device.on('accept', (accept) => {
      console.log('accept', accept);
    });
    device.on('cancel', (cancel) => {
      console.log('cancel', cancel);
    });
    device.on('rejected', (rejected) => {
      if (rejected.statusCode === 486) {
        setRejectStt(11);
        console.log('khach tu tat may khi chua cam may');
      } else if (rejected.statusCode === 487) {
        setRejectStt(12);
        console.log('user chu dong tat');
      } else if (rejected.statusCode === 500) {
        setRejectStt(13);
        console.log('ko tra loi');
      }
    });
    device.on('destroyed', (data) => {
      console.log('destroyed', data);
    });
    device.on('failed', (failed) => {
      console.log('failed13131133', failed);
    });
    device.on('bye', () => {
      console.log('bye');
    });
    device?.on('replaced', (replaced) => {
      console.log('replaced', replaced);
    });

    device?.on('terminated', (response, cause) => {
      console.log('terminated', response, cause);
    });
    device?.on('trackAdded', (trackAdded) => {
      console.log('trackAdded', trackAdded);
    });
    device?.on('refer', (response, newSession) => {
      console.log('refer', response, newSession);
    });

    deviceclv.current = device;
  }, []);
  //* Lấy dữ liệu cuộc gọi đến và user
  const { dataAfterParse, user } = useAuth();
  //* Số điện thoại gọi đến
  const [phoneUserCall, setPhoneUserCall] = useState(null);
  //* API link
  const { getCustomerByPhone, postCustomer } = useAxios();
  //* dùng chuyển hướng
  const navigate = useNavigate();
  //* Theo dõi trạng thái, nếu đổ chuông cập nhật số 
  useEffect(() => {
    if (dataAfterParse?.Status === 'Ringing') {
      setPhoneUserCall(dataAfterParse?.CallNumber);
    } else {
      setPhoneUserCall(null);
    }
  }, [dataAfterParse]);

  //* Lấy dữ liệu khách theo số gọi đến
  const { data: customer, refetch } = useQuery(
    ['ctmbyphone', phoneUserCall],
    () => getCustomerByPhone(phoneUserCall),
    { enabled: !!phoneUserCall },
  );
    //* Nếu không có số trong database sẽ tự động tạo
  const postCustomerMutation = useMutation(postCustomer, {
    onSuccess: (data) => {
      if (data.status === 'Success') {
        refetch();
      }
    },
  });
  //* Check xem số có trong database không, có chuyển hướng, không tự tạo
  useEffect(() => {
    if (phoneUserCall && customer?.length) {
      navigate(`/staff/${customer[0].id}`);
    }
    if (phoneUserCall && customer?.length === 0) {
      const datasavephone = {
        firstName: null,
        lastName: null,
        phoneNumber: phoneUserCall,
        email: null,
        address: null,
        dayOfBith: null,
        gender: null,
        status: 1,
        channelId: null,
        levelId: 2,
        userId: +user?.Id,
        sourceDataId: null,
      };
      //* Tạo người dùng mới
      postCustomerMutation.mutate({
        data: datasavephone,
        CampaignId: 2,
      });
    }
  }, [phoneUserCall, customer]);

  return (
    <Context.Provider
      value={{
        setRejectStt,
        rejectStt,
        deviceclv,
      }}
    >
      {children}
    </Context.Provider>
  );
}
