import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/ET-logo.jpeg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginPage = ({ loginSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();

    const userPayload = {
      email,
      password,
    };

    try {
      // Call the loginSubmit function and get the response from the backend
      const response = await loginSubmit(userPayload);

      // Save the access token to localStorage
      localStorage.setItem('accessToken', response.accessToken);

      toast.success('Logged in successfully');

      // Wait before redirecting to the home page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <section className="bg-indigo-50 rounded-xl shadow-md relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <div className="g-6 flex flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full max-w-lg">
              <div className="block rounded-lg bg-white shadow-md">
                <div className="px-4 md:px-0">
                  <div className="md:mx-6 md:p-8 text-center">
                    <div>
                      <img className="mx-auto w-28" src={logo} alt="logo" />
                      <h4 className="mb-6 mt-1 text-4xl font-semibold text-gray-700">
                        Admin Login
                      </h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <p className="mb-6 text-xl text-gray-700">
                        Please login to your account
                      </p>
                      {/* Email input */}
                      <div className="mb-4 text-left">
                        <label className="block font-bold mb-2 text-gray-700">
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          className="border rounded w-full py-2 px-3 mb-2 text-black"
                          placeholder="test@gmail.com"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>

                      {/* Password input */}
                      <div className="mb-6 text-left">
                        <label className="block font-bold mb-2 text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="border rounded w-full py-2 px-3 mb-2 text-black"
                            placeholder="*********"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <span
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-3 cursor-pointer text-gray-500"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </div>

                      {/* Submit button */}
                      <div className="mb-8 pb-2 text-center text-xl">
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
