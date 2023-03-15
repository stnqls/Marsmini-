import React from "react";
import { useRouter } from "next/router";

import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import UserList from "./user/UserList";
import CoinWithdrawal from "./withdrawal/CoinWithdrawal";
import Setting from "./settings/Setting";
import "./Body.scss";

function Body() {
  const router = useRouter();
  const page = router.query.page;

  let title;

  if (page === "userList") {
    title = "회원 목록";
  } else if (page === "coinWithdrawal") {
    title = "코인 출금 관리";
  } else if (page === "settings") {
    title = "게임 설정";
  } else {
    title = "관리자 페이지";
  }

  return (
    <div className="body">
      <div className="body__sidebar">
        <Sidebar />
      </div>
      <Header title={title} />
      <div className="body__content">
        {page === "userList" && <UserList />}
        {page === "coinWithdrawal" && <CoinWithdrawal />}
        {page === "settings" && <Setting />}
      </div>
    </div>
  );
}

export default Body;
