// styles
import styles from './DetailsUser.module.css';
// components
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { History } from './History';
// contexts
import { useAxios } from '../../context/AxiosContex';
import { useAuth } from '../../context/AuthContext';
import { useSip } from '../../context/SipContext';
// Modules
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Howl, Howler } from 'howler';
//File
import Tele from '../../assets/tele.mp3';

export default function DetailsUser() {
  // Id params
  const { id } = useParams();
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
    return <Navigate to='/staff' />;
  }
  // get customer
  const { data: customer } = useQuery(['customer', id], () => getCustomer(id), {
    enabled: !!id,
  });

  // get channels
  const { data: channels } = useQuery(['channels', brand], () =>
    getChannels(brand),
  );
  //get source
  const { data: source } = useQuery(['source', brand], () => getSource(brand));

  if (customer?.status === 400) {
    return navigate('/staff');
  }

  useEffect(() => {
    if (dataAfterParse?.Status === 'Ringing') {
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
      dataAfterParse?.Status === 'Ringing'
        ? '??ang ????? chu??ng'
        : dataAfterParse?.Status === 'Up'
        ? '??ang n??i chuy???n'
        : dataAfterParse?.Status === 'Down'
        ? '???? t???t m??y'
        : '',
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
      setTotalTime('');
      setRealTime('');
      setLink('');
      setCode('');
      setNote('');
      setStatus('');
      setDataAfterParse('');
      setDataCalled('');
      toast('L??u th??nh c??ng', {
        icon: '????',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    },
  });
  // save history function

  function handleSaveHistoryCall() {
    const dataPost = {
      callNumber: dataAfterParse?.CallName || '',
      receiptNumber: customer?.customer.dataUsers.phoneNumber,
      keyRinging: dataAfterParse?.KeyRinging || '',
      dateCall: Date.now(),
      message: 'test',
      status: status,
      totalTiemCall: +totalTime,
      realTimeCall: +realTime,
      linkFile: link || '',
      typeCall: dataAfterParse?.Direction || '',
      dataUserId: +customer?.customer.dataUsers.id,
      userId: +customer?.customer.dataUsers.userId,
      note: note,
      levelId: lvIdRef.current.value,
      rating: 5,
      orderCode: '',
      campaignId: 0,
    };
    if (!totalTime || !note || !status) {
      toast('Kh??ng b??? tr???ng m???c n??o', {
        icon: '????',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    saveHistory.mutate(dataPost);
  }

  const updateCustomerMutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
  });
  //Update
  const handleUpdate = (e) => {
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
      toast('Kh??ng ???????c b??? tr???ng', {
        icon: '????',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
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
    updateCustomerMutation.mutate({ id, data });
    toast('C???p nh???t th??nh c??ng', {
      icon: '????',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    navigate('/staff');
  };
  //C???m m??y
  function acceptCall() {
    deviceclv?.current.accept();
    sound.pause();
    Howler.volume(0);
  }
  // T???t m??y, h???y cu???c g???i
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
              <h6 style={{ paddingBottom: '5px' }}>
                Kh??ch h??ng: {firstName + ' ' + lastName}
              </h6>
            )}
            <h4
              style={{
                marginTop: '20px',
                fontSize: '14px',
                color: 'rgb(73, 163, 241)',
              }}
            >
              M??y nh??nh: {user?.CFDisplay}
            </h4>
            {dataAfterParse ? (
              <div className={styles.btn__usercall}>
                <span style={{ display: 'block', color: 'grey' }}>
                  {dataAfterParse?.CallNumber}
                </span>
                {dataAfterParse?.Status === 'Ringing' && (
                  <Button
                    className={styles.btn__usercal}
                    onClick={acceptCall}
                  >
                    Nghe m??y
                  </Button>
                )}
                {dataAfterParse?.Status === 'Up' && (
                  <Button
                    className={styles.btn__canc}
                    onClick={rejectCall}
                  >
                    T???t m??y
                  </Button>
                )}
              </div>
            ) : null}
            <form>
              <div className={styles.field}>
                <label>Ng?????i Ph??? Tr??ch</label>
                <Input
                  disabled
                  type='text'
                  value={userName}
                />
              </div>
              <div className={styles.field}>
                <label>H???</label>
                <Input
                  type='text'
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div className={styles.field}>
                <label>T??n</label>
                <Input
                  type='text'
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
              <div className={styles.field}>
                <label>S??? ??i???n tho???i</label>
                <Input
                  disabled
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type='number'
                  value={phoneNumber}
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  value={email}
                />
              </div>
              <div className={styles.field}>
                <label>?????a ch???</label>
                <Input
                  onChange={(e) => setAddress(e.target.value)}
                  type='text'
                  value={address}
                />
              </div>
              <div className={styles.field}>
                <label>Level KH</label>
                <select ref={lvIdRef}>
                  {customer?.customer?.levels &&
                    customer?.customer?.levels.map((lv, index) => {
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
                <label>K??nh KH</label>
                <select ref={cnIdRef}>
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
                <label>Ngu???n KH</label>
                <select ref={scref}>
                  {source &&
                    source.map((sc, index) => (
                      <option
                        value={sc.id}
                        key={index}
                      >
                        {sc.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Gi???i t??nh</label>
                <select ref={genderRef}>
                  <option value='1'>Nam</option>
                  <option value='0'>Nu</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Ng??y sinh</label>
                <Input
                  ref={dateRef}
                  type='date'
                />
              </div>
              <div className={styles.buttonkk}>
                <Button
                  className={styles.btn_kk}
                  onClick={() => navigate('/staff')}
                >
                  Quay v???
                </Button>
                <Button
                  className={styles.btn_kk2}
                  onClick={handleUpdate}
                >
                  C???p nh???t
                </Button>
              </div>
            </form>
          </div>

          {/* form2 */}
          <div className={styles.form2}>
            <h6>Th??ng tin cu???c g???i</h6>
            <div
              style={{ marginTop: '10px' }}
              className={styles.buttonsk}
            >
              <Link
                style={{ width: '100%' }}
                to={`/staff/${id}/schedule`}
                target='_blank'
              >
                <Button className={styles.btn_details}>L???ch h???n</Button>
              </Link>
              <Link
                style={{ width: '100%' }}
                to={`/staff/${id}/order`}
                target='_blank'
              >
                {' '}
                <Button className={styles.btn_details}>?????t h??ng</Button>
              </Link>
            </div>
            <form>
              <div className={styles.field}>
                <label>Th???i gian g???i</label>
                <Input
                  onChange={(e) => setTotalTime(e.target.value)}
                  value={totalTime}
                  type='number'
                />
              </div>
              <div className={styles.field}>
                <label>Tr???ng th??i</label>
                <Input
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Th???c g???i</label>
                <Input
                  disabled
                  onChange={(e) => setRealTime(e.target.value)}
                  value={realTime}
                  type='number'
                />
              </div>
              <div className={styles.field}>
                <label>LinkFile</label>
                <Input
                  disabled
                  onChange={(e) => setLink(e.target.value)}
                  value={link}
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Code</label>
                <Input
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  disabled
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Th??ng tin cu???c g???i</label>
                <Input
                  onChange={(e) => setNote(e.target.value)}
                  type='text'
                  value={note}
                />
              </div>
            </form>
            <Button
              className={styles.btn_details2}
              onClick={handleSaveHistoryCall}
            >
              L??u cu???c g???i
            </Button>
          </div>
        </div>
        {/* History order */}
        <History />
      </div>
    </div>
  );
}
