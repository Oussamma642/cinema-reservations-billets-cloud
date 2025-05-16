import { Navigate, createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import NotFound from "./views/NotFound";
import Home from "./views/Home";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Films from "./views/Films";
import FilmDetail from "./views/FilmDetail";
import CreateReservation from "./views/CreateReservation";
import ReservationSuccess from "./views/ReservationSuccess";
import UserReservations from "./views/UserReservations";
import AdminDashboard from "./views/AdminDashboard";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/films" />
      },
      {
        path: '/films',
        element: <Films />
      },
      {
        path: '/films/:id',
        element: <FilmDetail />
      },
      {
        path: '/reservations/create/:seanceId',
        element: <CreateReservation />
      },
      {
        path: '/reservations/success',
        element: <ReservationSuccess />
      },
      {
        path: '/reservations',
        element: <UserReservations />
      },
      {
        path: '/admin',
        element: <AdminDashboard />
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default routes; 