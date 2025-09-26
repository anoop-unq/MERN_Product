import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage";
import UserProfile from "./components/UserProfile";
import { AddBio } from "./components/AddBio";
import EditProfile from "./components/EditProfile";
import EditPost from "./components/EditPost";
import ViewUsers from "./components/ViewUsers";
import UsersImage from "./components/UsersImage";
import DuplicateView from "./components/DuplicateView";
import  ViewSpecificUser  from "./components/ViewSpecificUser";
import GuestLogin from "./components/GuestLogin";
// import  ViewDetailPrduct  from "./components/ViewDetailProduct";
import SellerContact from "./components/SellerContact";
import  ViewAllProductsUser  from "./components/ViewAllProductsUser";
import ViewSeperateProduct from "./components/ViewSeperateProduct";


function App() {
  return (
   <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Routes>
      <Route path="/" element={<Home/>}/>
      {/* <Route path="/login" element={<Login/>}/> */}
        <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Login />} />

      <Route path="/email-verify" element={<EmailVerify/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/home" element={<HomePage />}/>
      <Route path="/user-profile/:id" element={<UserProfile />} />
      <Route path="/add-bio/:id" element={<AddBio />}/>
      <Route path="/edit-profile/:id" element={<EditProfile />}/>
      <Route path="/edit-post/:id" element={<EditPost />}/>
      <Route path="/view-users/:userId" element={<ViewUsers/>}/>
      <Route path="/view-specific-user/:userId" element={<ViewSpecificUser />}/>
      <Route path="/view-users/image/:userId" element={<UsersImage />} />
      {/* <Route path="/view-detail/product/:userId" element={<ViewDetailPrduct />}/> */}
      <Route path="/view-detail/product/:userId/:postId" element={<ViewSeperateProduct />}/>
      <Route path="/view-seller/contact-details/:userId" element={<SellerContact />}/>
      <Route path="/view-all/products/:userId/:postId" element={<ViewAllProductsUser />}/>
      <Route path="/view-user/image/:userId" element={<DuplicateView />}/>
      <Route path="/guest" element={<GuestLogin/>}/>
    </Routes>
  
   </div>
  );
}

export default App;
