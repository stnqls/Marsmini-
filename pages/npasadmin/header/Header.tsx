import React from "react";
import "./Header.scss";

function Header(props: any) {
  return (
    <div className="admin-header">
      <div className="admin-header__title">{props.title}</div>
    </div>
  );
}

export default Header;
