import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/header/Header";
import Home from "./components/pages/Home";
import "./App.css";
import Main from "./components/layouts/Main";
import Footer from "./components/common/footer/Footer";
import Ranking from "./components/pages/Ranking";
import Challenge from "./components/pages/Challenge";
import Profile from "./components/pages/Profile";
import Edit from "./components/pages/Edit";
import Login from "./components/pages/Login";
import Technical from "./components/pages/Technical";
import Delete from "./components/pages/admin/Delete";
import Register from './components/pages/admin/Register';
import Test from './components/pages/admin/Test';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/Challenge" element={<Challenge />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/technical" element={<Technical />} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<Test />}/>
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
