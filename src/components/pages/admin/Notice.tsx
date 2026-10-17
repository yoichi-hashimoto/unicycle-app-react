import classes from "./Notice.module.css";
import Button from "../../common/button/Button";
import { useState} from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../common/modal/Loading";
import Toast from "../../common/modal/Toast";
import { ChangeEvent, FormEvent } from "react";
import { noticeCategories } from "../../../features/notices/categories";

type NoticeType = {
  title: string;
  text: string;
  category: string;
  starts_at: string;
  location: string;
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
    category: "その他", starts_at: "", location: "",
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      await axios.post("/api/notices", {
        title: formData.title, text: formData.text, category: formData.category,
        ...(formData.category === "練習会のお知らせ" ? {
          starts_at: new Date(formData.starts_at).toISOString(), location: formData.location,
        } : {}),
      });

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
            <label htmlFor="notice-category">通知カテゴリ</label>
            <select id="notice-category" name="category" value={formData.category} onChange={handleChange}>
              {noticeCategories.map(category => <option key={category}>{category}</option>)}
            </select>
          </div>
          {formData.category === "練習会のお知らせ" && <>
            <div className={classes.inputForm}>
              <label htmlFor="practice-date">開催日時</label>
              <input id="practice-date" type="datetime-local" name="starts_at" value={formData.starts_at} onChange={handleChange} required />
            </div>
            <div className={classes.inputForm}>
              <label htmlFor="practice-location">場所</label>
              <input id="practice-location" name="location" value={formData.location} maxLength={100} onChange={handleChange} required />
            </div>
          </>}
          <div className={classes.inputForm}>
            <label htmlFor="notice-title">タイトル </label>
            <input
              id="notice-title"
              maxLength={16}
              required
              placeholder="ここへ入力"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputText}>
            <label htmlFor="notice-text">テキスト </label>
            <textarea
              id="notice-text"
              maxLength={200}
              required
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
