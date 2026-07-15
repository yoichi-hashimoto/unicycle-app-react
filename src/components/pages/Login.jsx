import classes from "./PageCommon.module.css";
import Button from "../common/button/Button";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { fetchLoginUser } from "../../api/auth";
import Toast from "../common/modal/Toast";
import Loading from "../common/modal/Loading";

function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [toast, setToast] = useState({ message: "" });
  const [credentials, setCredentials] = useState({
    login_id: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function showToast(message, type = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
      });
    }, 2500);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  async function handleLogin(e) {
    e.preventDefault();

    if (!credentials.login_id.trim()) {
      showToast("IDを入力してください", "error");
      return;
    }

    if (!credentials.password.trim()) {
      showToast("パスワードを入力してください", "error");
      return;
    }
    try {
      setIsLoading(true);
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/login", {
        login_id: credentials.login_id,
        password: credentials.password,
      });

      const user = await fetchLoginUser();
      setUser(user);
      showToast("ログインしました","success");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        showToast("IDまたはパスワードの形式が正しくありません", "error");
      } else if (error.response?.status === 401) {
        showToast("IDまたはパスワードが違います", "error");
      } else {
        showToast("ログインに失敗しました", "error");
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={classes.contentsWrapper}>
      <form>
        <h2>ログイン</h2>
        {isLoading && <Loading />}
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
          {toast.message && (
            <div className={classes.toastWrapper }>
            <Toast type={toast.message} message={toast.message} /></div>
          )}</div>
      </form>
    </div>
  );
}

export default Login;
