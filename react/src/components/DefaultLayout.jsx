import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function DefaultLayout() {

    const { notification, user, token, setUser, setToken } = useStateContext();

    if (!token) {
        return <Navigate to="/auth/login" />;
    }



  return (
    <div>
      <h1>Def Layout</h1>
      <Outlet />
    </div>
  );
}
