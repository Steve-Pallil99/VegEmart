import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Layout_i from "./Layout_i";
import Landingpage from './Landingpage';
import HomeBrowse from './HomeBrowse';
import View from './View';
import Cart from './Cart';
import CartProduce from './CartProduce';
import Contactpage from './Contactpage';
import Adminpage from './Adminpage';
import Adminorder from './Adminorder';
import Productmanage from './Productmanage';
import Ordermanage from './Ordermanage';
import Viewpage from './Viewpage';
import Userdashboard from './Userdashboard';
import Admindashboard from './Admindashboard';
import Admindetails from './Admindetails';
import Usermanage from './Usermanage';
import Userregister from './Userregister';
import Userlogin from './Userlogin';
import Userreview from './Userreview';
import Userfield from './UserField';
import Resetpass from './Resetpass';
import { Route, Routes } from 'react-router';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Routes>

      <Route element={<Layout_i></Layout_i>}>

        <Route path="/" element={<Landingpage></Landingpage>} />
        <Route path="/HomeBrowse" element={<HomeBrowse></HomeBrowse>} />
        <Route path="/View/:id" element={<View></View>} />
        <Route path="/Cart" element={<Cart></Cart>} />
        <Route path="/CartProduce" element={<CartProduce></CartProduce>} />
        <Route path="/Contactpage" element={<Contactpage></Contactpage>} />
         <Route path="/Adminpage" element={<Adminpage></Adminpage>} />
          <Route path="/Productmanage" element={<Productmanage></Productmanage>} />
          <Route path="/Ordermanage" element={<Ordermanage></Ordermanage>} />
           <Route path="/Viewpage" element={<Viewpage></Viewpage>} />
            <Route path="/Userdashboard" element={<Userdashboard></Userdashboard>} />
              <Route path="/Usermanage" element={<Usermanage></Usermanage>} />
               <Route path="/Userregister" element={<Userregister></Userregister>} />
                <Route path="/Userlogin" element={<Userlogin></Userlogin>} />
               <Route path="/Userreview" element={<Userreview></Userreview>} />
               <Route path="/Userfield" element={<Userfield></Userfield>} />
               <Route path="/reset-password/:id" element={<Resetpass></Resetpass>} />
               <Route path="/Adminorder" element={<Adminorder></Adminorder>} />
               <Route path="/Admindetails" element={<Admindetails></Admindetails>} />
             <Route path="/Admindashboard" element={<Admindashboard></Admindashboard>} />
      </Route>

    </Routes>
  )
}
export default App

 