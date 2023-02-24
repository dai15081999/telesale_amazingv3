import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function Admin() {
  const { user } = useAuth();
  if (Object.values(user)[9] != "admin") {
    return <Navigate to={`/${Object.values(user)[9]}`} />;
  }
  return <>admin</>;
}

export default Admin;
