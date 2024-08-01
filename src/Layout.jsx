import { Outlet } from "react-router-dom";

import Header from "./Header";

export default function Layout(){
    return(
        <div className='px-10 py-10 max-w-screen-2xl m-0 bg-blue-50'>
            <Header ></Header>
            <Outlet></Outlet>

        </div>

    );
}