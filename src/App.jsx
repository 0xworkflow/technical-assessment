import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import Contact from "./components/Contact/Contact";
import Villas from "./components/Villa/Villas";
import SingleVilla from './components/Villa/SingleVilla';
import ManageVillas from "./components/Villa/ManageVillas";
import TermsAndConditions from './components/TermsAndConditions/TermsAndConditions';
import Notes from './components/Notes/Notes';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Auth/Profile";
import LenisProvider from './components/LenisProvider';
import AppLayout from "./components/Layout/AppLayout";
import { AuthProvider } from "./context/AuthContext";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AppLayout>
      <div key={location.pathname} className="motion-safe:animate-route-in">
        <Routes location={location}>
          <Route path='/' element={<Home/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/termsandconditions' element={<TermsAndConditions/>}/>
          <Route path='/villas' element={<Villas/>}/>
          <Route path='/villa/:id' element={<SingleVilla/>}/>
          <Route path='/manage' element={<ManageVillas/>}/>
          <Route path='/notes' element={<Notes/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </div>
    </AppLayout>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LenisProvider />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
