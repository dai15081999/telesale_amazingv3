// icons
import { AiOutlinePlus } from 'react-icons/ai';
import { CiSquareRemove } from 'react-icons/ci';
// styles
import './Orderx.styles.css';
// modules
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useRef } from 'react';
// context
import { useAxios } from '../../../context/AxiosContex';
//functions
import { formatMoney } from '../../../utils/functions';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Order() {
  const { getAllProducts, getCustomer, saveProducts, saveProductsToOrder } =
    useAxios();
  const { id } = useParams();
  const [prod, setProd] = useState([]);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const noteRef = useRef();

  //get all products
  const { data: products } = useQuery(['products'], getAllProducts);
  const { data: customer } = useQuery(['customer', id], () => getCustomer(id), {
    enabled: !!id,
  });

  useEffect(() => {
    if (products) {
      setProd(products);
    }
  }, [products]);

  const filterPro = useMemo(() => {
    return prod?.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [prod, query]);

  const calculateTotal = (items) =>
    items.reduce((ack, item) => ack + item.price * item.amount, 0);

  const handleAddToCart = (clickedItem) => {
    setItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item,
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };
  const handleRemoveFromCart = (id) => {
    setItems((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, []),
    );
  };
  const postProductToOrder = useMutation({
    mutationFn: (data) => {
      return saveProductsToOrder(data).then((res) => {
        return res;
      });
    },
    onSuccess(data2) {
      if (data2?.status === 'Success') {
        toast('?????t h??ng th??nh c??ng', {
          icon: '????',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        navigate(`/staff/${id}`);
      }
    },
  });
  let dataPostOrder = [];
  const postProduct = useMutation({
    mutationFn: (data) => {
      return saveProducts(data).then((res) => {
        return res;
      });
    },
    onSuccess(data2) {
      if (data2?.status === 'Success') {
        items?.forEach((elm) => {
          dataPostOrder.push({
            productId: elm?.id,
            quantity: elm?.amount,
            price: elm?.price,
            orderId: data2?.order,
          });
        });
        postProductToOrder.mutate(dataPostOrder);
      }
    },
  });

  function handlePostProduct() {
    const data = {
      userId: +customer?.customer.dataUsers.userId,
      dataUserId: +customer?.customer.dataUsers.id,
      status: +customer?.customer.dataUsers.status,
      note: noteRef.current.value || '',
      amount: +calculateTotal(items),
      levelId: +customer?.customer.dataUsers.levelId,
      brandId: +customer?.customer.dataUsers.brandId,
      code: customer?.customer.dataUsers.code,
      expectedDate: new Date(),
      storeId: 13,
      campaignId: 8,
    };
    if (!noteRef.current.value) {
      toast('Kh??ng ???????c b??? tr???ng m???c n??o', {
        icon: '????',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    postProduct.mutate(data);
  }

  return (
    <>
      <div className='wrapper1'>
        <div className='container'>
          <div className='form1'>
            <h5>Danh s??ch S???n ph???m/D???ch v???</h5>
            <input
              onChange={(e) => setQuery(e.target.value)}
              type='text'
              placeholder='T??m ki???m...'
            />
            <ul>
              <div className='head'>
                <li>STT</li>
                <li>S???n ph???m</li>
                <li>T???ng ti???n</li>
                <li>Th??m</li>
              </div>
              <div className='contents'>
                {filterPro?.map((prd, index) => (
                  <div
                    key={prd.id}
                    className='content'
                  >
                    <li>{index + 1}</li>
                    <li>{prd.name}</li>
                    <li>{formatMoney(prd.price)}</li>
                    <li onClick={() => handleAddToCart(prd)}>
                      <AiOutlinePlus
                        style={{ cursor: 'pointer', fontSize: '18px' }}
                      />
                    </li>
                  </div>
                ))}
              </div>
            </ul>
          </div>
          <div className='form2'>
            <div className='head_form2'>
              <h5>Th??ng tin kh??ch h??ng</h5>
              <button onClick={handlePostProduct}>?????t mua</button>
            </div>
            <div className='form2_input'>
              <div>
                <label>Kh??ch H??ng</label>
                <input
                  disabled
                  type='text'
                  value={
                    customer &&
                    `${customer?.customer.dataUsers.lastName} ${customer?.customer.dataUsers.firstName}`
                  }
                />
              </div>
              <div>
                <label>S??? ??i???n tho???i</label>
                <input
                  disabled
                  type='text'
                  value={customer && customer?.customer.dataUsers.phoneNumber}
                />
              </div>
              <div>
                <label>?????a ch???</label>
                <input
                  disabled
                  type='text'
                  value={customer && customer?.customer.dataUsers.address}
                />
              </div>
              <div>
                <label>Th??nh ti???n</label>
                <input
                  type='text'
                  value={formatMoney(calculateTotal(items))}
                  disabled
                />
              </div>
              <div>
                <label>Ghi ch??</label>
                <input
                  ref={noteRef}
                  type='text'
                />
              </div>
            </div>
          </div>
          <div className='form3'>
            <h5>H??a ????n</h5>
            <ul>
              <div className='head'>
                <li>STT</li>
                <li>S???n ph???m</li>
                <li>T???ng ti???n</li>
                <li>Quantity</li>
                <li>X??a</li>
              </div>
              <div className='contents'>
                {items.map((it, id) => (
                  <div
                    key={id}
                    className='content'
                  >
                    <li>{id + 1}</li>
                    <li>{it.name}</li>
                    <li>{formatMoney(it.price)}</li>
                    <li>
                      <input
                        type='text'
                        disabled
                        value={it?.amount}
                      />
                    </li>
                    <li onClick={() => handleRemoveFromCart(it.id)}>
                      <CiSquareRemove
                        style={{ cursor: 'pointer', fontSize: '19px' }}
                      />
                    </li>
                  </div>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
