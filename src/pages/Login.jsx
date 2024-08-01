import { useContext, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    async function login(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/login", {
                username,
                password
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setUserInfo(response.data);
                navigate('/');
            }
        } catch (e) {
            if (e.response?.status === 404) {
                alert('USER NOT FOUND');
            }else if(e.response?.status === 411){
                alert('Invalid credentials');
            }
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 w-full max-w-md">
                <a href="#" className="flex items-center mb-6 text-4xl font-bold text-gray-900 dark:text-gray-900">
                    Login
                </a>
                <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        
                        <form className="space-y-4 md:space-y-6" onSubmit={login}>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                Don’t have an account yet? 
                                <a href="#" className="font-medium text-sky-600 hover:underline dark:text-sky-500 hover:text-sky-700 dark:hover:text-sky-400">
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
