//!modules
import { createContext, useEffect, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
//! hooks
import { useLocalStorage } from "../hooks/useStorage";
//! api link
import { useAxios } from "./AxiosContex";
import {
  HttpTransportType,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { REACT_URL_SIGNAL } from "../utils/ENV";

const Context = createContext();

export function useAuth() {
  return useContext(Context);
}

export function AuthProvider({ children }) {
  const { loginUser } = useAxios();
  const [user, setUser, removeUser] = useLocalStorage("user", null);
  const [token, setToken, removeToken] = useLocalStorage("token", null);
  const [brand, setBrand, removeBrand] = useLocalStorage("brand", null);
  const [message, setMessage] = useState(null);
  const [connection, setConnection] = useState(null);
  const [dataCalled, setDataCalled] = useState(null);
  const [dataAfterParse, setDataAfterParse] = useState(null);

  useEffect(() => {
    if (!connection) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(REACT_URL_SIGNAL, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Debug)
        .withAutomaticReconnect()
        .build();
      setConnection(newConnection);
    }
  }, [connection]);

  if (connection && connection?.state !== HubConnectionState.Connected) {
    connection.start().then(() => {
      connection.on("SendMessage", async (data) => {
        setDataCalled(data);
      });
    });
  }
  useEffect(() => {
    if (dataCalled) {
      const { message } = dataCalled;
      const parse = JSON.parse(message);
      setDataAfterParse(parse);
    }
  }, [dataCalled]);
  // Login
  useEffect(() => {
    if (!token) return;
    const jwtUser = jwtDecode(token);
    setUser(jwtUser);
  }, [token]);

  //? Login mutation
  const login = useMutation({
    mutationFn: (data) => {
      return loginUser(data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    },
    onSuccess(data) {
      setToken(data?.tokenString);
      if (user) {
        return <Navigate to={`${Object.values(user)[9]}`} replace />;
      }
    },
  });

  return (
    <Context.Provider
      value={{
        dataAfterParse,
        dataCalled,
        removeUser,
        removeToken,
        token,
        login,
        user,
        message,
        setBrand,
        brand,
        removeBrand,
        setDataCalled,
        setDataAfterParse,
      }}
    >
      {children}
    </Context.Provider>
  );
}
