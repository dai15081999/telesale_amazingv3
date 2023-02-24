import styles from "./User.module.css";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function User() {
  const { user } = useAuth();
  if (Object.values(user)[9] != "staff") {
    return <Navigate to={`/${Object.values(user)[9]}`} />;
  }
  return (
    <div>
      <h1>user</h1>
    </div>
  );
}

export default User;
