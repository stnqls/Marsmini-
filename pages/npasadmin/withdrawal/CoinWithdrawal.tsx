import { useEffect, useState } from "react";
import axios from "axios";
import functions from "../../../lib/functions";
import Pagination from "react-js-pagination";

import CoinWithdrawalItem from "./CoinWithdrawalItem";
import "./CoinWithdrawal.scss";

const CoinWithdrawal = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [item] = useState(10);

  function clickMenu(target: number) {
    const menus = document.getElementsByClassName(
      "admin-coin-withdrawal__head__menu__list"
    );
    const menu = document.getElementById(`admin-coin-withdrawal-${target}`);
    const className = "active";

    for (let i = 0; i < menus.length; i++) {
      const check = new RegExp("(\\s|^)" + className + "(\\s|$)");
      if (menus[i]) {
        menus[i].className = menus[i].className.replace(check, " ").trim();
      }
    }

    const check = new RegExp("(\\s|^)" + className + "(\\s|$)");
    if (menu) {
      if (check.test(menu.className)) {
        return 0;
      } else {
        menu.className += " " + className;
      }
    }
  }

  function getData(activePage: number) {
    setPage(activePage);
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: `https://us-central1-npas-78659.cloudfunctions.net/api/admin/withdrawal?type=trx&status=${status}&search=${search}&page=${activePage}`,
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
            functions.refreshToken(getData);
          }
        }
      });
  }

  useEffect(() => {
    getData(1);
    setPage(1);
  }, [status, search]);

  useEffect(() => {
    clickMenu(0);
  }, []);

  return (
    <div className="admin-coin-withdrawal">
      <div className="admin-coin-withdrawal__head">
        <ul className="admin-coin-withdrawal__head__menu">
          <li
            className={"admin-coin-withdrawal__head__menu__list"}
            id="admin-coin-withdrawal-0"
            onClick={() => {
              clickMenu(0);
              setStatus("");
            }}
          >
            전체보기
          </li>
          <li
            className={"admin-coin-withdrawal__head__menu__list"}
            id="admin-coin-withdrawal-1"
            onClick={() => {
              clickMenu(1);
              setStatus("101");
            }}
          >
            신청중
          </li>
          <li
            className={"admin-coin-withdrawal__head__menu__list"}
            id="admin-coin-withdrawal-2"
            onClick={() => {
              clickMenu(2);
              setStatus("102");
            }}
          >
            승인완료
          </li>
          <li
            className={"admin-coin-withdrawal__head__menu__list"}
            id="admin-coin-withdrawal-3"
            onClick={() => {
              clickMenu(3);
              setStatus("109");
            }}
          >
            승인거절
          </li>
        </ul>
        <input
          type="text"
          className="admin-coin-withdrawal__head__search"
          placeholder="E-mail로 검색하기"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="admin-coin-withdrawal__body">
        <table className="admin-coin-withdrawal-table">
          <thead className="admin-coin-withdrawal-table__thead">
            <tr className="admin-coin-withdrawal-table__thead__tr">
              <td>ID</td>
              <td>E-mail</td>
              <td>Point</td>
              <td>Status</td>
              <td className="admin-coin-withdrawal-table__thead__tr__date">
                Date
              </td>
            </tr>
          </thead>
          <tbody className="admin-coin-withdrawal-table__tbody">
            {data && data.length > 0 ? (
              data.map((item: any, index: number) => (
                <CoinWithdrawalItem
                  key={`admin-coin-withdrawal-table-${index}`}
                  address={item.address}
                  amount={item.amount}
                  created={item.created}
                  email={item.email}
                  name={item.name}
                  point={item.point}
                  seq={item.seq}
                  status={item.status}
                  txid={item.txid}
                />
              ))
            ) : (
              <tr className="admin-coin-withdrawal-table__tbody__none">
                <td colSpan={5}>내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        {data && data.length > 0 && (
          <Pagination
            totalItemsCount={total}
            onChange={getData}
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
  );
};

export default CoinWithdrawal;
