import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/lg.png';

export function LeftStaff({ hide }) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <section
      id='sidebar'
      className={hide ? 'hide' : ''}
    >
      <a className='brand'>
        <i className='bx bxs-smile icon'></i> Telesale
      </a>
      <ul className='side-menu'>
        <li onClick={() => navigate('/staff')}>
          <a className={location.pathname.startsWith('/staff') ? 'active' : ''}>
            <i className='bx bxs-dashboard icon'></i> Quản lý khách hàng
          </a>
        </li>
        <li onClick={() => navigate('/chien-dich')}>
          <a
            className={
              location.pathname.startsWith('/chien-dich') ? 'active' : ''
            }
          >
            <i className='bx bxs-chart icon'></i> Quản lý thương hiệu
          </a>
        </li>
        <li onClick={() => navigate('/lich')}>
          <a className={location.pathname.startsWith('/lich') ? 'active' : ''}>
            <i className='bx bxs-widget icon'></i> Quản lý người dùng
          </a>
        </li>
        <li onClick={() => navigate('/lich')}>
          <a className={location.pathname.startsWith('/lich') ? 'active' : ''}>
            <i className='bx bxs-widget icon'></i> Quản lý công việc
          </a>
        </li>
        <li onClick={() => navigate('/lich')}>
          <a className={location.pathname.startsWith('/lich') ? 'active' : ''}>
            <i className='bx bxs-widget icon'></i> Cấu hình máy nhánh
          </a>
        </li>
      </ul>
      <div className='ads'>
        <div className='wrapper'>
          <a
            href='#'
            className='btn-upgrade'
          >
            <img
              className='imglg'
              src={logo}
              alt='logo'
            />
          </a>
          <p>
            Sử dụng <span>Telesale</span> để tận hưởng <span>tất cả!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
