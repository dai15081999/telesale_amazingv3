import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export function LeftStaff({ hide }) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <section id="sidebar" className={hide ? "hide" : ""}>
      <a className="brand">
        <i className="bx bxs-smile icon"></i> Telesale
      </a>
      <ul className="side-menu">
        <li onClick={() => navigate("/staff")}>
          <a className={location.pathname.startsWith("/staff") ? "active" : ""}>
            <i className="bx bxs-dashboard icon"></i> Quản lý khách hàng
          </a>
        </li>
        <li onClick={() => navigate("/chien-dich")}>
          <a
            className={
              location.pathname.startsWith("/chien-dich") ? "active" : ""
            }
          >
            <i className="bx bxs-chart icon"></i> Chiến dịch
          </a>
        </li>
        <li onClick={() => navigate("/lich")}>
          <a className={location.pathname.startsWith("/lich") ? "active" : ""}>
            <i className="bx bxs-widget icon"></i> Lịch
          </a>
        </li>
        <li className="divider" data-text="table and forms">
          Mục khác
        </li>
        <li onClick={() => navigate("/new-board")}>
          <a
            className={
              location.pathname.startsWith("/new-board") ? "active" : ""
            }
          >
            <i className="bx bx-table icon"></i> Bảng thông tin
          </a>
        </li>
        <li onClick={() => navigate("/call-report")}>
          <a
            className={
              location.pathname.startsWith("/call-report") ? "active" : ""
            }
          >
            <i className="bx bx-table icon"></i> Báo cáo cuộc gọi
          </a>
        </li>
        <li onClick={() => navigate("/order-report")}>
          <a
            className={
              location.pathname.startsWith("/order-report") ? "active" : ""
            }
          >
            <i className="bx bx-table icon"></i> Báo cáo đơn hàng
          </a>
        </li>
        <li onClick={() => navigate("/campaign-report")}>
          <a
            className={
              location.pathname.startsWith("/campaign-report") ? "active" : ""
            }
          >
            <i className="bx bx-table icon"></i> Báo cáo chiến dịch
          </a>
        </li>
      </ul>
      <div className="ads">
        <div className="wrapper">
          <a href="#" className="btn-upgrade">
            Liên hệ
          </a>
          <p>
            Sử dụng <span>Telesale</span> để tận hưởng <span>tất cả!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
