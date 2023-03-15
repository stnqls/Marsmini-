import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import functions from "../lib/functions";

import "../styles/pages/Main.scss";

const Main = () => {
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState();
  const [point, setPoint] = useState();

  function logout() {
    window.sessionStorage.clear();
    alert("정상적으로 로그아웃 되었습니다.");
    setLogin(false);
    location.href = "/";
  }

  function getUserInfo() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/users",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setEmail(res.data.email);
          setPoint(res.data.point);
          window.sessionStorage.setItem("point", res.data.point);
        }
      })
      .catch((err) => {
        if (err.response.data.errCode === 101) {
          functions.refreshToken(getUserInfo);
        }
      });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="main">
      <div className="main__content">
        <div className="main__content__user">
          <div className="main__content__user__point">
            {functions.addComma(point)}P
          </div>
          <div className="main__content__user__email">{email}</div>
          <img
            src="/images/logout.png"
            alt="logout"
            className="main__content__user__logout"
            onClick={() => {
              logout();
            }}
          />
        </div>
        <ul className="main__content__menu">
          <Link href="/CoinWithdrawal">
            <li className="main__content__menu__list">
              <img src="/images/icon1.png" alt="icon1" />
              코인 출금 신청
            </li>
          </Link>

          <Link href="/CoinList">
            <li className="main__content__menu__list">
              <img src="/images/icon2.png" alt="icon2" />
              코인 출금 내역
            </li>
          </Link>

          <Link href="/PointList">
            <li className="main__content__menu__list">
              <img src="/images/icon4.png" alt="icon4" />
              포인트 내역
            </li>
          </Link>

          <Link href="/InvitationList">
            <li className="main__content__menu__list">
              <img src="/images/icon3.png" alt="icon3" />
              초대 내역
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Main;
