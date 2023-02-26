// modules
import { createContext, useContext, useMemo } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
// ENV
import { REACT_URL } from '../utils/ENV';

// Axios context
const AxiosContext = createContext();

export default function AxiosProvider({ children }) {
  const navigate = useNavigate();
  const axios = useMemo(() => {
    //? interceptors axios
    const axios = Axios.create({
      baseURL: REACT_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
        ? JSON.parse(localStorage.getItem('token'))
        : '';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        //! Nếu token hết hạn tự động logout
        if (error.response.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('brand');
          localStorage.removeItem('token');
          navigate('/login');
        }
        return Promise.reject(error);
      },
    );
    return axios;
  }, []);

  //* Đăng nhập
  const loginUser = (data) =>
    axios.post('/users/login', data).then((res) => res.data);
  //* Lấy toàn bộ khách nhân viên quản lý
  const getAllStaff = (roleId) =>
    axios
      .get(`/users`, roleId)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy toàn bộ thương hiệu
  const getBrands = () =>
    axios
      .get('/brands')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy thương hiệu theo ID
  const getBrandById = (id) =>
    axios
      .get(`/brands/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả level khách hàng
  const getLevelUser = (id) =>
    axios
      .get(`/levels/brand/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách hàng
  const getCustomers = () =>
    axios
      .get('/customers')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách theo brand, và name
  const getCustomersStaff = ({ brandId, name }) =>
    axios
      .get(`/customers?BrandId=${brandId}&Username=${name}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách theo ID chiến dịch
  const getCustomersByCapaignId = (id) =>
    axios
      .get(`/customers?CampaignId=${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả chiến dịch
  const getcampaigns = (id) =>
    axios
      .get(`/campaign?brandId=${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Thêm chiến dịch vào user
  const postCampaignToUser = (data) =>
    axios
      .post(`/campaign/AddCustomer`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tải lên khách hàng
  const postCustomer = ({ data, CampaignId }) =>
    axios
      .post(`/customers?CampaignId=${CampaignId}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy chiến dịch theo ID
  const getCampaignbyID = (id) =>
    axios
      .get(`/campaign/${id}}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy dữ liệu
  const getSource = (id) =>
    axios
      .get(`/source-datas`, id)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả kênh
  const getChannels = (id) =>
    axios
      .get(`/channels`, id)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy khách hàng theo ID
  const getCustomer = (id) =>
    axios
      .get(`/customers/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhất khách hàng
  const updateCustomer = ({ id, data }) =>
    axios
      .patch(`/customers/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //*Lấy tất cả khách theo số điện thoại
  const getCustomerByPhone = (phone) =>
    axios
      .get(`/customers?PhoneNumber=${phone}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu lịch sử cuộc gọi
  const saveHistoryCalled = (data) =>
    axios
      .post('/call-histories', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả sản phẩm
  const getAllProducts = () =>
    axios
      .get('/products')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu đơn mới
  const saveProducts = (data) =>
    axios
      .post('/orders', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu sản phẩm vào đơn
  const saveProductsToOrder = (data) =>
    axios
      .post('/orders/details', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch sử đặt hàng theo ID khách
  const getOrderById = (id) =>
    axios
      .get(`/orders/customer/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả kho theo brand ID
  const getAllstore = (brandID) =>
    axios
      .get(`/stores?brandId=${brandID}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu lịch trình mới
  const postSchedule = (data) =>
    axios
      .post('/schedule', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch trình theo ID nhân viên
  const getScheduleById = (id) =>
    axios
      .get(`/schedule?userId=${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch sử cuộc gọi theo ID khách và brand
  const getHistoriesById = ({ brand, id }) =>
    axios
      .get(`/call-histories?DataUserId=${id}&BrandId=${brand}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy data sau khi lọc
  const getCustomerFilter = ({
    ChannelId,
    SourceDataId,
    LevelId,
    BrandId,
    Username,
  }) =>
    axios
      .get(
        `/customers${ChannelId ? `?ChannelId=${ChannelId}` : ''}${
          SourceDataId ? `&SourceDataId=${SourceDataId}` : ''
        }${LevelId ? `&LevelId=${LevelId}` : ''}${
          BrandId ? `&BrandId=${BrandId}` : ''
        }${Username ? `&Username=${Username}` : ''}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

  return (
    <AxiosContext.Provider
      value={{
        postCampaignToUser,
        getCustomerFilter,
        getHistoriesById,
        getOrderById,
        saveProductsToOrder,
        getCampaignbyID,
        getScheduleById,
        getCustomersByCapaignId,
        getCustomersStaff,
        postSchedule,
        getAllstore,
        saveProducts,
        getAllProducts,
        saveHistoryCalled,
        getCustomerByPhone,
        updateCustomer,
        getCustomer,
        loginUser,
        getAllStaff,
        getBrands,
        getBrandById,
        getLevelUser,
        getCustomers,
        getcampaigns,
        postCustomer,
        getSource,
        getChannels,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios() {
  return useContext(AxiosContext);
}
