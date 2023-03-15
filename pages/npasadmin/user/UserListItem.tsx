import axios from "axios";
import router from "next/router";
import React, { useState } from "react";
import functions from "../../../lib/functions";

const UserListItem = (props: any) => {
  const [edit, setEdit] = useState(false);
  const [point, setPoint] = useState("");

  function changePoint() {
    if (point === "") {
      return setEdit(false);
    } else if (point !== "") {
      const headers: any = {
        authorization: window.sessionStorage.getItem("accessToken"),
      };
      axios({
        method: "PATCH",
        url: `https://us-central1-npas-78659.cloudfunctions.net/api/admin/users/${props.user_code}`,
        headers,
        data: {
          point: point,
        },
      })
        .then(() => {
          alert("포인트 변경이 완료되었습니다.");
          setEdit(false);
          router.reload();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            if (err.response.data.errCode === 101) {
              functions.refreshToken(changePoint);
            }
          }
        });
    }
  }

  return (
    <tr className="admin-user-list-table__body__tr">
      <td>
        {edit ? (
          <button
            className="admin-user-list-table__body__edit-save"
            onClick={() => {
              changePoint();
            }}
          >
            수정완료
          </button>
        ) : (
          <img
            src="/images/icon_edit.png"
            alt="edit"
            className="admin-user-list-table__body__edit"
            onClick={() => {
              setEdit(true);
            }}
          />
        )}
      </td>
      <td>{props.user_code}</td>
      <td>{props.email}</td>
      {edit ? (
        <td>
          <input
            type="number"
            className="admin-user-list-table__body__input-point"
            // defaultValue={props.point}
            placeholder={props.point}
            onChange={(e) => {
              setPoint(e.target.value);
            }}
          />
        </td>
      ) : (
        <td>{functions.addComma(props.point)}</td>
      )}
      <td>
        <button
          type="button"
          className="admin-user-list-table__btn btn-right"
          onClick={() => {
            props.setPointModal(true);
            props.setUserCode(props.user_code);
          }}
        >
          포인트내역
        </button>
        <button
          type="button"
          className="admin-user-list-table__btn"
          onClick={() => {
            props.setInvitationModal(true);
            props.setUserCode(props.user_code);
          }}
        >
          초대내역
        </button>
      </td>
      <td>{props.created}</td>
    </tr>
  );
};

export default UserListItem;
