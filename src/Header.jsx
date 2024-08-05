import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";
import { Backend_Url } from "./config";

export default function Header() {
  const { userinfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserInfo(null);
          return;
        }

        const response = await axios.get(`${Backend_Url}/profile`, {
          headers: {
            Authorization: token
          }
        });

        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserInfo(null);
      }
    };

    fetchProfile();
  }, [userinfo]);

  async function logout() {
    localStorage.removeItem('token');
    navigate('/login');
    setUserInfo(null);
  }

  return (
    <main>
      <header className="flex flex-col md:flex-row justify-between items-center px-4 py-2">
        <Link to="/" className="text-4xl text-gray font-bold font-poppins mb-4 md:mb-0">BlogIt</Link>
        <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          {userinfo ? (
            <>
              <p className="text-emerald-500 font-semibold text-lg text-center">Welcome {userinfo.username}</p>
              <Link to="/create" className="bg-gray text-gray-900 hover:text-white hover:bg-blue-600 border border-transparent rounded-lg px-4 py-2 transition-colors duration-200">Create New Post</Link>
              <a className="bg-gray text-gray-900 hover:text-white hover:bg-blue-600 border border-transparent rounded-lg px-4 py-2 transition-colors duration-200 cursor-pointer" onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray text-lg hover:text-blue-300 focus:outline-none focus:text-blue-300 ">Login</Link>
              <Link to="/register" className="text-gray text-lg hover:text-blue-300 focus:outline-none focus:text-blue-300 ">Register</Link>
            </>
          )}
        </nav>
      </header>
    </main>
  );
}
