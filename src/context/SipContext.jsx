//!modules
import { createContext, useContext, useRef, useEffect, useState } from "react";
//! api link
import { useNavigate } from "react-router-dom";
import { clvDevice } from "telesale";
import { useAuth } from "./AuthContext";
import { useAxios } from "./AxiosContex";
import { useQuery, useMutation } from "@tanstack/react-query";
//get customers

const Context = createContext();

export function useSip() {
  return useContext(Context);
}

export function SipProvider({ children }) {
  const [rejectStt, setRejectStt] = useState();
  const deviceclv = useRef(null);
  let config = {
    host: "cf-pbx0001442.cfvn.cloud",
    port: "4433",
    displayName: `106`,
    username: `106`,
    password: `Zaq@1234`,
    wsServers: "wss://rtc.cloudfone.vn:4433",
  };

  useEffect(() => {
    const device = new clvDevice(config);
    device.on("connecting", () => {
      console.log("connecting!");
    });
    device.on("accepted", (data) => {
      console.log(data)
      setRejectStt(9);
    });
    device.on("invite", (data) => {
      console.log("new data", data);
    });
    device.on("accept", (accept) => {
      console.log("accept", accept);
    });
    device.on("cancel", (cancel) => {
      console.log("cancel", cancel);
    });
    device.on("rejected", (rejected) => {
      if (rejected.statusCode === 486) {
        setRejectStt(11);
        console.log("khach tu tat may khi chua cam may");
      } else if (rejected.statusCode === 487) {
        setRejectStt(12);
        console.log("user chu dong tat");
      } else if (rejected.statusCode === 500) {
        setRejectStt(13);
        console.log("ko tra loi");
      }
    });
    device.on("destroyed", (data) => {
      console.log("destroyed", data);
    });
    device.on("failed", (failed) => {
      console.log("failed13131133", failed);
    });
    device.on("bye", () => {
      console.log("bye");
    });
    device?.on("replaced", (replaced) => {
      console.log("replaced", replaced);
    });

    device?.on("terminated", (response, cause) => {
      console.log("terminated", response, cause);
    });
    device?.on("trackAdded", (trackAdded) => {
      console.log("trackAdded", trackAdded);
    });
    device?.on("refer", (response, newSession) => {
      console.log("refer", response, newSession);
    });

    deviceclv.current = device;
  }, []);
  const { dataAfterParse, user } = useAuth();
  const [phoneUserCall, setPhoneUserCall] = useState(null);
  const { getCustomerByPhone, postCustomer } = useAxios();
  const navigate = useNavigate();
  useEffect(() => {
    if (dataAfterParse?.Status === "Ringing") {
      setPhoneUserCall(dataAfterParse?.CallNumber);
    } else {
      setPhoneUserCall(null);
    }
  }, [dataAfterParse]);

  const { data: customer, refetch } = useQuery(
    ["ctmbyphone", phoneUserCall],
    () => getCustomerByPhone(phoneUserCall),
    { enabled: !!phoneUserCall },
  );

  const postCustomerMutation = useMutation(postCustomer, {
    onSuccess: (data) => {
      if (data.status === "Success") {
        refetch();
      }
    },
  });

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
