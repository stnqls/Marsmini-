import React, { useState } from "react";
import Link from "next/link";
import "./Sidebar.scss";

function Sidebar() {
  const [toggle, setToggle] = useState([true, true, true]);

  const toggleChange = (index: any) => {
    setToggle((prestate) => ({
      ...prestate,
      [index]: !prestate[index],
    }));
  };

  function logout() {
    window.sessionStorage.clear();
    alert("정상적으로 로그아웃 되었습니다.");
    location.href = "/";
  }

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <Link href="/npasadmin">
          <span className="sidebar__list__top__span">
            MARS MINI
            <br />
            관리자시스템
          </span>
        </Link>
      </div>
      <button
        className="sidebar__logout"
        onClick={() => {
          logout();
        }}
      >
        LOGOUT
      </button>
      <ul className="sidebar__list">
        <li className="sidebar__list__item">
          <div
            className="sidebar__list__item__title"
            onClick={() => toggleChange(0)}
          >
            <span className="sidebar__list__item__title__span">회원관리</span>
          </div>
          <ul
            className={`sidebar__list__item__sublist ${
              toggle[0] ? "show" : ""
            }`}
          >
            <Link href="/npasadmin?page=userList">
              <li className="sidebar__list__item__sublist__subitem">
                회원 목록
              </li>
            </Link>
          </ul>
        </li>
        <li className="sidebar__list__item">
          <div
            className="sidebar__list__item__title"
            onClick={() => toggleChange(1)}
          >
            <span className="sidebar__list__item__title__span">출금관리</span>
          </div>
          <ul
            className={`sidebar__list__item__sublist ${
              toggle[1] ? "show" : ""
            }`}
          >
            <Link href="/npasadmin?page=coinWithdrawal">
              <li className="sidebar__list__item__sublist__subitem">
                코인 출금관리
              </li>
            </Link>
          </ul>
        </li>
        <li className="sidebar__list__item">
          <div
            className="sidebar__list__item__title"
            onClick={() => toggleChange(2)}
          >
            <span className="sidebar__list__item__title__span">설정</span>
          </div>
          <ul
            className={`sidebar__list__item__sublist ${
              toggle[2] ? "show" : ""
            }`}
          >
            <Link href="/npasadmin?page=settings">
              <li className="sidebar__list__item__sublist__subitem">
                게임설정
              </li>
            </Link>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
