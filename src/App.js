import React, { useEffect } from "react";
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
import Register from "./components/pages/admin/Register";
import Test from "./components/pages/admin/Test";
import { useAuthStore } from "./stores/authStore";
import { fetchLoginUser } from "./api/auth";
import AdminRoute from "./components/common/routes/AdminRoute";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    fetchLoginUser()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        setUser(null);
      });
  }, [setUser]);

  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/technical" element={<Technical />} />
            <Route path="/register" element={<AdminRoute><Register /></AdminRoute>} />
            <Route path="/test" element={<AdminRoute><Test /></AdminRoute>} />
            <Route path="/delete" element={<AdminRoute><Delete /></AdminRoute>} />
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
