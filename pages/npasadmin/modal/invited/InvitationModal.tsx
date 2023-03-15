import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import functions from "../../../../lib/functions";

import "./InvitationModal.scss";

const InvitationModal = (props: any) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [item] = useState(7);
  const [page, setPage] = useState(1);
  function changePage(page: number) {
    setPage(page);
  }

  function invitedModal(userCode: number) {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: `https://us-central1-npas-78659.cloudfunctions.net/api/admin/users/${userCode}/referral`,
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.rows);
          setTotal(res.data.count);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(invitedModal);
          }
        }
      });
  }

  useEffect(() => {
    invitedModal(props.userCode);
  }, []);

  return (
    <React.Fragment>
      <div
        className="invitation-modal-cover"
        onClick={() => {
          props.setInvitationModal(false);
        }}
      ></div>
      <div className="invitation-modal">
        <div className="invitation-modal__title">초대 내역</div>
        <img
          src="/images/close.png"
          alt="close"
          className="invitation-modal__close"
          onClick={() => {
            props.setInvitationModal(false);
          }}
        />
        <div className="invitation-modal__body">
          <div className="invitation-modal__body__total">TOTAL: {total}명</div>
          <table className="invitation-modal-table">
            <thead className="invitation-modal-table__thead">
              <tr>
                <td>Email</td>
                <td>User Code</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody className="invitation-modal-table__tbody">
              {data && data.length > 0 ? (
                data
                  .slice(item * (page - 1), item * (page - 1) + item)
                  .map((item: any, index: number) => (
                    <tr key={`admin-invitation-modal-${index}`}>
                      <td>{item.email}</td>
                      <td>{item.user_code}</td>
                      <td>{item.created}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3}>초대내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          {data && data.length > 0 && (
            <Pagination
              totalItemsCount={data.length}
              onChange={changePage}
              activePage={page}
              itemsCountPerPage={item}
              firstPageText={""}
              lastPageText={""}
              nextPageText={">"}
              prevPageText={"<"}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default InvitationModal;
