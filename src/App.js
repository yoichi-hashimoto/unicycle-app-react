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
import Notice from "./components/pages/admin/Notice";
import { useAuthStore } from "./stores/authStore";
import { fetchLoginUser } from "./api/auth";
import AdminRoute from "./components/common/routes/AdminRoute";
import MemberRoute from "./components/common/routes/MemberRoute";
import Beginner from "./components/pages/Beginner";
import Practices from "./components/pages/admin/Practices";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    let active = true;
    fetchLoginUser()
      .then((user) => {
        if (active && useAuthStore.getState().isLoading) setUser(user);
      })
      .catch(() => {
        if (active && useAuthStore.getState().isLoading) setUser(null);
      });
    return () => { active = false; };
  }, [setUser]);

  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route path="/practices" element={<AdminRoute><Practices /></AdminRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="/beginner" element={<Beginner />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/profile" element={<MemberRoute><Profile /></MemberRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit" element={<MemberRoute><Edit /></MemberRoute>} />
            <Route path="/technical" element={<Technical />} />
            <Route
              path="/register"
              element={
                <AdminRoute>
                  <Register />
                </AdminRoute>
              }
            />
            <Route
              path="/test"
              element={
                <AdminRoute>
                  <Test />
                </AdminRoute>
              }
            />
            <Route
              path="/delete"
              element={
                <AdminRoute>
                  <Delete />
                </AdminRoute>
              }
            />
            <Route
              path="/notice"
              element={
                <AdminRoute>
                  <Notice />
                </AdminRoute>
              }
            />
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
