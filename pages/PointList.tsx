import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "react-js-pagination";
import functions from "../lib/functions";
import axios from "axios";

import "../styles/pages/PointList.scss";

const PointList = () => {
  const [data, setData] = useState([]);
  const [item] = useState(7);
  const [page, setPage] = useState(1);
  function changePage(page: number) {
    setPage(page);
  }

  function getData() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/point",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.rows);
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
  function pointCode(code: number) {
    if (code === 0) {
      return "광고시청";
    } else if (code === 1) {
      return "광고(추천인)";
    } else if (code === 2) {
      return "광고(총판)";
    } else if (code === 3) {
      return "회원가입";
    } else if (code === 4) {
      return "회원가입(추천인)";
    } else if (code === 5) {
      return "회원가입(총판)";
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="point-list">
      <div className="point-list__content">
        <div className="point-list__content__title">포인트 내역</div>
        <div className="point-list__content__body">
          <Link href="/Main">
            <img
              src="/images/close.png"
              alt="close"
              className="point-list__content__body__close"
            />
          </Link>
          <ul className="point-list__content__body__list">
            {data && data.length > 0 ? (
              data
                .slice(item * (page - 1), item * (page - 1) + item)
                .map((item: any, index: number) => (
                  <li
                    className="point-list__content__body__list__item"
                    key={`point-list-${index}`}
                  >
                    <div className="point-list__content__body__list__item__point">
                      {item.addpoint}P
                    </div>
                    <div className="point-list__content__body__list__item__text">
                      {pointCode(item.addpoint_code)}
                    </div>
                    <div className="point-list__content__body__list__item__date">
                      {item.created}
                    </div>
                  </li>
                ))
            ) : (
              <li className="point-list__content__body__list__item__none">
                포인트 내역이 없습니다.
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
