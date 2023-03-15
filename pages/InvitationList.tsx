import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import functions from "../lib/functions";

import "../styles/pages/InvitationList.scss";

const PointList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [item] = useState(7);
  function changePage(page: number) {
    setPage(page);
  }

  function getData() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/referral",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(getData);
          }
        }
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="invitation-list">
      <div className="invitation-list__content">
        <div className="invitation-list__content__title">초대 내역</div>
        <div className="invitation-list__content__body">
          <Link href="/Main">
            <img
              src="/images/close.png"
              alt="close"
              className="invitation-list__content__body__close"
            />
          </Link>
          <ul className="invitation-list__content__body__list">
            {data && data.length > 0 ? (
              data
                .slice(item * (page - 1), item * (page - 1) + item)
                .map((data: any, index: number) => (
                  <li
                    className="invitation-list__content__body__list__item"
                    key={`invitation-${index}`}
                  >
                    <div className="invitation-list__content__body__list__item__email">
                      {data.email}
                    </div>
                    <div className="invitation-list__content__body__list__item__date">
                      {data.created}
                    </div>
                  </li>
                ))
            ) : (
              <li className="invitation-list__content__body__list__item__none">
                초대내역이 없습니다.
              </li>
            )}
          </ul>
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
    </div>
  );
};

export default PointList;
