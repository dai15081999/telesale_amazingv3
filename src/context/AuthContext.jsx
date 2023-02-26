//modules
import { createContext, useEffect, useState, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import jwtDecode from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import {
  HttpTransportType,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
// hooks
import { useLocalStorage } from '../hooks/useStorage';
// context
import { useAxios } from './AxiosContex';
// ENV
import { REACT_URL_SIGNAL } from '../utils/ENV';

const Context = createContext();
export function useAuth() {
  return useContext(Context);
}

export function AuthProvider({ children }) {
  //* Đăng nhập link
  const { loginUser } = useAxios();
  //* Localstorage
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  const [brand, setBrand, removeBrand] = useLocalStorage('brand', null);
  //* Message trả về khi đăng nhập
  const [message, setMessage] = useState(null);
  //* Biến kiểm tra connect socket
  const [connection, setConnection] = useState(null);
  //* Biến lưu dữ liệu trả về từ socket khi có khách gọi
  const [dataCalled, setDataCalled] = useState(null);
  //* Parse data từ socket
  const [dataAfterParse, setDataAfterParse] = useState(null);

  //* Kết nối socket
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

  //* Kiểm tra nếu có sự kiện thì trả về đata
  if (connection && connection?.state !== HubConnectionState.Connected) {
    connection.start().then(() => {
      connection.on('SendMessage', async (data) => {
        setDataCalled(data);
      });
    });
  }
  //* Parase data khi có
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

  //* Login mutation
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
        return (
          <Navigate
            to={`${Object.values(user)[9]}`}
            replace
          />
        );
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
