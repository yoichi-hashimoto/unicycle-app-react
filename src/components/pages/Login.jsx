import classes from "./PageCommon.module.css";
import Button from "../common/button/Button";
import axios from "axios";

const id = 1;
const password = "test";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
  await axios.get("/sanctum/csrf-cookie");
  await axios.post("/login", {
    id,
    password,
  });

const res = axios.get('/api/user');
console.log(res.data);

function Login() {


  return (
    <div className={classes.contentsWrapper}>
      <h2>ログイン</h2>
      <div className={classes.loginInputContainer}>
        <label htmlFor="">ID </label>
        <input type="text" />
      </div>
      <div className={classes.loginInputContainer}>
        <label htmlFor="">パスワード </label>
        <input type="password" />
      </div>
      <div className={classes.loginButton}>
        <Button variant="primary">ログインする</Button>
      </div>
    </div>
  );
}

export default Login;
