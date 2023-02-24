//! CSS
import "./Login.css";
//! Cờ
import car from "../../../assets/logo.png";
//Modules
import { toast } from "react-hot-toast";
import { useRef } from "react";
//Components
import { useAuth } from "../../../context/AuthContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Loading } from "../../../components/Loading";

function Login() {
  const nameRef = useRef();
  const passwordRef = useRef();

  const { login, message } = useAuth();
  if (message) {
    toast.error("Tài khoản không hợp lệ");
  }
  //Hàm đăng nhập
  async function handleLogin(e) {
    e.preventDefault();
    const name = nameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!name || !password) {
      return toast.error("Không được bỏ trống mục nào");
    }
    await login.mutateAsync({ userName: name, password });
  }
  return (
    <div className="form__login">
      <div className="logindiv card">
        <form className="loginform">
          <h5 className="loginh">Đăng nhập</h5>
          <br />
          <h6>Tên đăng nhập</h6>
          <Input
            ref={nameRef}
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
          />
          <br />
          <h6>Mật khẩu</h6>
          <Input
            ref={passwordRef}
            type="password"
            className="form-control"
            placeholder="Nhập mật khẩu của bạn"
          />
          <br />
          <br />
          <Button onClick={handleLogin} className="btn btn-primary loginbtn">
            {login.isLoading ? (
              <Loading size={20} color="white" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
        <div className="info">
          <img style={{ opacity: 0 }} src={car} />
          <h5>Telesale</h5>
          <h6>Cảm ơn bạn đã sử dụng dịch vụ!</h6>
        </div>
      </div>
    </div>
  );
}

export default Login;
