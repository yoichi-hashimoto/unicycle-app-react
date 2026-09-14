import classes from "./Notice.module.css";
import Button from "../../common/button/Button";
import { useState} from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../common/modal/Loading";
import Toast from "../../common/modal/Toast";
import { ChangeEvent, FormEvent } from "react";

type NoticeType = {
  title: string;
  text: string;
};

type ToastType = {
  message: string;
  type: string;
};

function Notice() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NoticeType>({
    title: "",
    text: "",
  });
  const [toast, setToast] = useState<ToastType>({
    message: "",
    type: "",
  });

  const showToast = (message: string, type = "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 2500);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/notices", formData);

      showToast("登録しました", "success");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("エラー", error);
      showToast("入力に誤りがあります", "fail");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className={classes.inputContainer}>
        <h1>お知らせ投稿</h1>
        {isLoading && <Loading />}
        <form onSubmit={handleSubmit}>
          <div className={classes.inputForm}>
            <label htmlFor="">タイトル </label>
            <input
              placeholder="ここへ入力"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputText}>
            <label htmlFor="">テキスト </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
            ></textarea>
          </div>
        <div className={classes.submitButton}>
          <Button variant="primary" type="submit">
            投稿する
          </Button>
          </div>
        </form>
        <Toast message={toast.message} type={toast.type} />
      </div>
    </>
  );
}

export default Notice;
