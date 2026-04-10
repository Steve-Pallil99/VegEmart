import Appnavbar from "./Appnavbar";
import Appfooter from "./Appfooter";
import { Outlet } from "react-router";

function Layout_i() {
  return (
    <>
    
    <div className="min-vh-100 d-flex flex-column">
      <Appnavbar></Appnavbar>

<div className="h-100 " >
      <Outlet></Outlet>
   </div>   


      <Appfooter></Appfooter>
      </div>
    </>
  );
}

export default Layout_i;
