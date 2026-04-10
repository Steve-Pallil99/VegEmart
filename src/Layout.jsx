import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";

function Layout() {
  return (
    
   <>
   
      <Navbar />
  <Route path="/HomeBrowse" element={<HomeBrowse></HomeBrowse>}></Route>
   <Route path="/View" element={<View></View>}></Route>
   <Route path="/Cart" element={<Cart></Cart>}></Route>
   <Route path="/CartProduce" element={<CartProduce></CartProduce>}></Route>
   

      <Outlet />
      
      <Footer />
     
    </>
     
  );
}

export default Layout;
