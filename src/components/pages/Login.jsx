import classes from "./PageCommon.module.css";
import Button from "../common/button/Button";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { fetchLoginUser } from "../../api/auth";

function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state)=>state.setUser);
  const [credentials, setCredentials] = useState({
    login_id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  async function handleLogin() {
    await axios.get("/sanctum/csrf-cookie");
    await axios.post("/login", {
      login_id: credentials.login_id,
      password: credentials.password,
    });

    const res = await axios.get("/api/user");
    console.log(res.data);
    const user = await fetchLoginUser();
    setUser(user);
    navigate("/profile");
  }
  return (
    <div className={classes.contentsWrapper}>
      <form>
        <h2>ログイン</h2>
        <div className={classes.loginInputContainer}>
          <label htmlFor="">ID </label>
          <input
            type="text"
            name="login_id"
            value={credentials.login_id}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div className={classes.loginInputContainer}>
          <label htmlFor="">パスワード </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <div className={classes.loginButton}>
          <Button variant="primary" type="button" onClick={handleLogin}>
            ログインする
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
