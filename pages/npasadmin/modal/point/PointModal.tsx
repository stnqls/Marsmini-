import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-js-pagination";
import Pagination from "react-js-pagination";
import functions from "../../../../lib/functions";

import "./PointModal.scss";

const PointModal = (props: any) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [item] = useState(10);
  const [page, setPage] = useState(1);
  function changePage(page: number) {
    setPage(page);
  }

  function PointModal(userCode: number) {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: `https://us-central1-npas-78659.cloudfunctions.net/api/admin/users/${userCode}/point`,
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.rows);
          setTotal(res.data.totalPoint);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(PointModal);
          }
        }
      });
  }

  function pointCode(code: number) {
    if (code === 0) {
      return "광고시청 포인트 적립";
    } else if (code === 1) {
      return "광고(추천인) 포인트 적립";
    } else if (code === 2) {
      return "광고(총판) 포인트 적립";
    } else if (code === 3) {
      return "회원가입 포인트 적립";
    } else if (code === 4) {
      return "회원가입(추천인) 포인트 적립";
    } else if (code === 5) {
      return "회원가입(총판) 포인트 적립";
    }
  }

  useEffect(() => {
    PointModal(props.userCode);
  }, []);

  return (
    <React.Fragment>
      <div
        className="point-modal-cover"
        onClick={() => {
          props.setPointModal(false);
        }}
      ></div>
      <div className="point-modal">
        <div className="point-modal__title">포인트 내역</div>
        <img
          src="/images/close.png"
          alt="close"
          className="point-modal__close"
          onClick={() => {
            props.setPointModal(false);
          }}
        />
        <div className="point-modal__content">
          <div className="point-modal__content__total">
            TOTAL :{functions.addComma(total)} P
          </div>
          <table className="point-modal-table">
            <thead className="point-modal-table__thead">
              <tr>
                <td>Point</td>
                <td>Detail</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody className="point-modal-table__tbody">
              {data && data.length > 0 ? (
                data
                  .slice(item * (page - 1), item * (page - 1) + item)
                  .map((item: any, index: number) => (
                    <tr key={`admin-point-modal-${index}`}>
                      <td>{item.addpoint}</td>
                      <td>{pointCode(item.addpoint_code)}</td>
                      <td>{item.created}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3}>포인트 내역이 존재하지 않습니다.</td>
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

export default PointModal;
