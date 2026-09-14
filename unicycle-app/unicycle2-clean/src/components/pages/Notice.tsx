import classes from "./Notice.module.css";
import Button from "../common/button/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../common/modal/Loading";
import Toast from "../common/modal/Toast";
import { ChangeEvent, FormEvent } from "react";

type NoticeType = {
  title: string;
  text: string;
};

type ToastType = {
  message: string;
  type: string;
}

function Notice() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NoticeType>({
    title: "",
    text:"",
  });
  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const showToast = (message:string, type = "error") =>{
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 2500);
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value,
    }));
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.get("./sanctum/csrf-cookie");
      const response = await axios.post(`/api/notices`, formData);
      const result = response.data;
      showToast("登録しました", "success");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("エラー", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className={classes.inputContainer}>
        <h1>お知らせ投稿</h1>
        {isLoading && <Loading />}
        <div className={classes.inputForm}>
          <label htmlFor="">タイトル </label>
          <input placeholder="ここへ入力" />
        </div>
        <div className={classes.inputText}>
          <label htmlFor="">テキスト </label>
          <textarea />
        </div>
        <div className={classes.submitButton}>
          <Button variant="primary" onClick={handleSubmit}>
            投稿する
          </Button>
        </div>
        <Toast message={toast.message} type={toast.type} />
      </div>
    </>
  );
}

export default Notice;
