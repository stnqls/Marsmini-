import axios from "axios";
import { useEffect, useState } from "react";
import functions from "../../../../lib/functions";

import "./NoticeSetting.scss";

const NoticeSetting = () => {
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [chTitle, setChTitle] = useState("");
  const [chContent, setChContent] = useState("");
  const [isChecked, setIsChecked]: any = useState();

  function getNotice() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/settings/notice",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          let isShow: string = res.data.notice_status === "Y" ? "보임" : "숨김";
          setStatus(isShow);
          setIsChecked(isShow);
          setTitle(res.data.notice_title);
          setContent(res.data.notice);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(getNotice);
          }
        }
      });
  }

  function changeNotice() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "PATCH",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/settings/notice",
      headers,
      data: {
        notice_status: isChecked === "보임" ? "Y" : "N",
        notice_title: chTitle,
        notice: chContent,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          alert("공지사항변경이 완료되었습니다.");
          let isShow: string = res.data.notice_status === "Y" ? "보임" : "숨김";
          setStatus(isShow);
          setTitle(res.data.notice_title);
          setContent(res.data.notice);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(changeNotice);
          }
        }
      });
  }

  useEffect(() => {
    getNotice();
  }, []);

  return (
    <div className="admin-notice">
      <div className="admin-notice-show">
        <div className="admin-notice-show__top">현재 공지사항</div>
        <div className="admin-notice-show__content">
          <div className="admin-notice-show__content__status">
            공지사항 보이기/숨기기 : {status}
          </div>
          <div className="admin-notice-show__content__title">
            <span>제목 : </span> {title}
          </div>
          <div>내용</div>
          <div
            className="admin-notice-show__content__text"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>

      <div className="admin-notice-change">
        <div className="admin-notice-change__top">
          <span>현재 공지사항</span>
          <button
            type="button"
            className="admin-notice-change__top__btn"
            onClick={() => {
              changeNotice();
            }}
          >
            변경하기
          </button>
        </div>
        <div className="admin-notice-change__content">
          <div className="admin-notice-change__content__status">
            공지사항 보이기/숨기기 :
            <input
              type="checkbox"
              id="showChb"
              onChange={(e) => {
                if (e.target.checked) {
                  setIsChecked("보임");
                } else {
                  setIsChecked("숨김");
                }
              }}
              checked={isChecked === "보임"}
            />
            <label htmlFor="showChb">{isChecked}</label>
          </div>
          <div className="admin-notice-change__content__title">
            제목
            <input
              type="text"
              className="admin-notice-change__content__title__input"
              maxLength={20}
              onChange={(e) => {
                setChTitle(e.target.value);
              }}
            />
          </div>
          <div className="admin-notice-change__content__text">
            내용
            <textarea
              className="admin-notice-change__content__text__input"
              maxLength={180}
              onChange={(e) => {
                setChContent(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeSetting;
