import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import NoNavbarLayout from './layouts/NoNavbarLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
const baseUrl = import.meta.env.VITE_API_BASE_URL

const App = () => {
  // const accessToken = localStorage.getItem('accessToken');

  // Login User
  const loginUser = async user => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // If the response is not successful, throw an error
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const loggedInUser = await res.json();
    return loggedInUser.data;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Use NoNavbarLayout for login */}
        <Route path="/login" element={<NoNavbarLayout />}>
          <Route index element={<LoginPage loginSubmit={loginUser} />} />
        </Route>

        {/* Fallback for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
