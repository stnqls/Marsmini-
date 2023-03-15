import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import functions from "../lib/functions";

import CoinListItem from "../component/coinList/CoinListItem";
import "../styles/pages/CoinList.scss";

const CoinList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [item] = useState(5);
  function changePage(page: number) {
    setPage(page);
  }

  function getData() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/withdrawal",
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
    <div className="coin-list">
      <div className="coin-list__content">
        <div className="coin-list__content__head">
          <div className="coin-list__content__head__title">코인 출금 내역</div>
        </div>
        <div className="coin-list__content__body">
          <Link href="/Main">
            <img
              src="/images/close.png"
              alt="close"
              className="coin-list__content__body__close"
            />
          </Link>
          <ul className="coin-list__content__body__list">
            {data && data.length > 0 ? (
              data
                .slice(item * (page - 1), item * (page - 1) + item)
                .map((data: any, index: number) => (
                  <CoinListItem
                    key={`coin-list-${index}`}
                    address={data.address}
                    amount={data.amount}
                    created={data.created}
                    point={data.point}
                    status={data.status}
                    txid={data.txid}
                  />
                ))
            ) : (
              <li className="coin-list__content__body__list__none">
                출금내역이 없습니다.
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

export default CoinList;
