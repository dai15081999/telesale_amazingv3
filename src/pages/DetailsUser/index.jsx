// styles
import styles from "./DetailsUser.module.css";
// components
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
// contexts
import { useAxios } from "../../context/AxiosContex";
import { useAuth } from "../../context/AuthContext";
import { useSip } from "../../context/SipContext";
// Modules
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Howl, Howler } from "howler";
//File
import Tele from "../../assets/tele.mp3";
//icons
import { IoIosArrowDropdown } from "react-icons/io";

export default function DetailsUser() {
  // Id params
  const { id } = useParams();
  const location = useLocation();
  // Navigate
  const navigate = useNavigate();
  // query client
  const queryClient = useQueryClient();
  // useSip
  const { deviceclv } = useSip();
  // useAuth
  const { brand, user, dataAfterParse, setDataCalled, setDataAfterParse } =
    useAuth();

  const {
    updateCustomer,
    getCustomer,
    getChannels,
    getSource,
    saveHistoryCalled,
  } = useAxios();
  const sound = new Howl({
    src: Tele,
    loop: true,
  });
  // check !brand redirect
  if (!id) {
    return <Navigate to="/staff" />;
  }

  // get customer
  const { data: customer } = useQuery(["customer", id], () => getCustomer(id), {
    enabled: !!id,
  });
  // get channels
  const { data: channels } = useQuery(["channels", brand], () =>
    getChannels(brand),
  );
  //get source
  const { data: source } = useQuery(["source", brand], () => getSource(brand));

  if (customer?.status === 400) {
    return navigate("/staff");
  }

  useEffect(() => {
    if (!location.pathname.startsWith(`/staff`)) {
      setDataAfterParse(null);
      setDataCalled(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (dataAfterParse?.Status === "Ringing") {
      sound.play();
      Howler.volume(1);
    } else {
      sound.pause();
      Howler.volume(0);
    }
  }, [dataAfterParse?.Status]);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [userName, setUsername] = useState(null);
  // data call
  const [totalTime, setTotalTime] = useState(null);
  const [realTime, setRealTime] = useState(null);
  const [link, setLink] = useState(null);
  const [status, setStatus] = useState(null);
  const [code, setCode] = useState(null);
  const [note, setNote] = useState(null);

  useEffect(() => {
    setFirstName(customer?.customer?.dataUsers?.firstName);
    setLastName(customer?.customer?.dataUsers?.lastName);
    setPhoneNumber(customer?.customer?.dataUsers?.phoneNumber);
    setEmail(customer?.customer?.dataUsers?.email);
    setAddress(customer?.customer?.dataUsers.address);
    setUsername(customer?.customer?.dataUsers.userName);
  }, [customer]);
  // data called
  useEffect(() => {
    setTotalTime(dataAfterParse?.Data?.TotalTimeCall);
    setRealTime(dataAfterParse?.Data?.RealTimeCall);
    setLink(dataAfterParse?.Data?.LinkFile);
    setStatus(
      dataAfterParse?.Status === "Ringing"
        ? "Đang đổ chuông"
        : dataAfterParse?.Status === "Up"
        ? "Đang nói chuyện"
        : dataAfterParse?.Status === "Down"
        ? "Đã tắt máy"
        : "",
    );
    setCode(dataAfterParse?.Key);
  }, [dataAfterParse]);

  const cnIdRef = useRef();
  const lvIdRef = useRef();
  const scref = useRef();
  const genderRef = useRef();
  const dateRef = useRef();

  // save called

  const saveHistory = useMutation({
    mutationFn: (data) => {
      return saveHistoryCalled(data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSuccess() {
      setTotalTime("");
      setRealTime("");
      setLink("");
      setCode("");
      setNote("");
      setStatus("");
      setDataAfterParse("");
      setDataCalled("");
      toast.success("Lưu thành công");
    },
  });
  // save history function

  function handleSaveHistoryCall() {
    const dataPost = {
      callNumber: dataAfterParse?.CallName || "",
      receiptNumber: customer?.customer.dataUsers.phoneNumber,
      keyRinging: dataAfterParse?.KeyRinging || "",
      dateCall: Date.now(),
      message: "test",
      status: status,
      totalTiemCall: +totalTime || 0,
      realTimeCall: +realTime || 0,
      linkFile: link || "",
      typeCall: dataAfterParse?.Direction || "",
      dataUserId: +customer?.customer.dataUsers.id,
      userId: +customer?.customer.dataUsers.userId,
      note: note,
      levelId: lvIdRef.current.value,
      rating: 5,
      orderCode: "",
      campaignId: 0,
    };
    saveHistory.mutate(dataPost);
  }

  const updateCustomerMutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    },
  });
  //Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !address ||
      !dateRef?.current.value ||
      !genderRef.current?.value ||
      !lvIdRef.current?.value ||
      !scref.current?.value
    ) {
      toast.error("Không được bỏ trống");
      return;
    }
    const data = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      dayOfBith: dateRef?.current.value,
      gender: +genderRef.current?.value,
      status: 0,
      channelId: +cnIdRef.current?.value,
      levelId: +lvIdRef.current?.value,
      userId: +user?.Id,
      sourceDataId: +scref.current?.value,
    };
    await updateCustomerMutation.mutateAsync({ id, data });
    toast.success("Update thành công");
    navigate("/staff");
  };
  //Cầm máy
  function acceptCall() {
    deviceclv?.current.accept();
    sound.pause();
    Howler.volume(0);
  }
  // Tắt máy, hủy cuộc gọi
  function rejectCall() {
    deviceclv?.current.reject();
    Howler.volume(0);
    sound.pause();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.details}>
        <div className={styles.forms}>
          <div className={styles.form1}>
            {firstName && (
              <h6 style={{ paddingBottom: "5px" }}>
                Khách hàng: {firstName + " " + lastName}
              </h6>
            )}
            <h4
              style={{
                marginTop: "20px",
                fontSize: "14px",
                color: "rgb(73, 163, 241)",
              }}
            >
              Máy nhánh: {user?.CFDisplay}
            </h4>
            {dataAfterParse ? (
              <div className={styles.btn__usercall}>
                <span style={{ display: "block", color: "grey" }}>
                  {dataAfterParse?.CallNumber}
                </span>
                {dataAfterParse?.Status === "Ringing" && (
                  <Button className={styles.btn__usercal} onClick={acceptCall}>
                    Nghe máy
                  </Button>
                )}
                {dataAfterParse?.Status === "Up" && (
                  <Button className={styles.btn__canc} onClick={rejectCall}>
                    Tắt máy
                  </Button>
                )}
              </div>
            ) : null}
            <form>
              <div className={styles.field}>
                <label>Người Phụ Trách</label>
                <Input disabled type="text" value={userName} />
              </div>
              <div className={styles.field}>
                <label>Họ</label>
                <Input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div className={styles.field}>
                <label>Tên</label>
                <Input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
              <div className={styles.field}>
                <label>Số điện thoại</label>
                <Input
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="number"
                  value={phoneNumber}
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                />
              </div>
              <div className={styles.field}>
                <label>Địa chỉ</label>
                <Input
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  value={address}
                />
              </div>
              <div className={styles.field}>
                <label>Level KH</label>
                <select ref={lvIdRef}>
                  {customer?.customer?.levels &&
                    customer?.customer?.levels.map((lv, index) => (
                      <option key={index} value={lv.id}>
                        {lv.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Kênh KH</label>
                <select ref={cnIdRef}>
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
                <select ref={scref}>
                  {source &&
                    source.map((sc, index) => (
                      <option value={sc.id} key={index}>
                        {sc.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Giới tính</label>
                <select ref={genderRef}>
                  <option value="1">Nam</option>
                  <option value="0">Nu</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Ngày sinh</label>
                <Input ref={dateRef} type="date" />
              </div>
              <div className={styles.buttonkk}>
                <Button
                  className={styles.btn_kk}
                  onClick={() => navigate("/staff")}
                >
                  Quay về
                </Button>
                <Button className={styles.btn_kk} onClick={handleUpdate}>
                  Cập nhật
                </Button>
              </div>
            </form>
          </div>

          {/* form2 */}
          <div className={styles.form2}>
            <h6>Thông tin cuộc gọi</h6>
            <div style={{ marginTop: "10px" }} className={styles.buttonsk}>
              <Button
                className={styles.btn_details}
                onClick={() => navigate(`/staff/${id}/schedule`)}
              >
                Lịch hẹn
              </Button>
              <Button
                onClick={() => navigate(`/staff/${id}/order`)}
                className={styles.btn_details}
              >
                Đặt hàng
              </Button>
            </div>
            <form>
              <div className={styles.field}>
                <label>Thời gian gọi</label>
                <Input
                  onChange={(e) => setTotalTime(e.target.value)}
                  value={totalTime}
                  type="number"
                />
              </div>
              <div className={styles.field}>
                <label>Trạng thái</label>
                <Input
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <label>Thực gọi</label>
                <Input
                  onChange={(e) => setRealTime(e.target.value)}
                  value={realTime}
                  type="number"
                />
              </div>
              <div className={styles.field}>
                <label>LinkFile</label>
                <Input
                  onChange={(e) => setLink(e.target.value)}
                  value={link}
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <label>Code</label>
                <Input
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  type="text"
                />
              </div>
              <div className={styles.field}>
                <label>Thông tin cuộc gọi</label>
                <Input onChange={(e) => setNote(e.target.value)} type="text" />
              </div>
            </form>
            <Button
              className={styles.btn_details2}
              onClick={handleSaveHistoryCall}
            >
              Lưu cuộc gọi
            </Button>
          </div>
        </div>
        <div className={styles.history_details}>
          <div className={styles.htr_order}>
            <h6>Lịch sử hóa đơn - Tổng: 1</h6>
            <IoIosArrowDropdown className={styles.iconh} />
          </div>
          <div className={styles.callphone}>
            <h6>Ghi chú cuộc gọi - Tổng: 1</h6>
            <IoIosArrowDropdown className={styles.iconh} />
          </div>
        </div>
      </div>
    </div>
  );
}
