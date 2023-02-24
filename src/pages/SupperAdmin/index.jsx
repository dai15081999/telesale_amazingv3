import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function SupperAdmin() {
  const { user } = useAuth();

  if (Object.values(user)[9] != "manager") {
    return <Navigate to={`/${Object.values(user)[9]}`} />;
  }
  return (
    <div>
      <h1>SupperAdmin</h1>
    </div>
  );
}

export default SupperAdmin;
