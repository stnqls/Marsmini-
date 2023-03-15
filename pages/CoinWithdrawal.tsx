import axios from "axios";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import functions from "../lib/functions";

import "../styles/pages/CoinWithdrawal.scss";

const CoinWithdrawal = () => {
  const [trx, setTrx] = useState();
  const [currentPoint, setCurrentPoint]: any = useState();
  const [point, setPoint] = useState("");
  const [address, setAddress] = useState("");
  let [expect, setExpect]: any = useState("");

  function getTrxPrice() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/withdrawal/trx_price",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setTrx(res.data.trx_price);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(getTrxPrice);
          }
        }
      });
  }

  function coinWithdrawal() {
    const inputPoint = point.replace(/,/g, "");
    if (address.length < 34) {
      alert("주소를 다시 확인해주세요");
    } else {
      if (Number(inputPoint) < 100000) {
        alert("100,000이상부터 가능합니다.");
      } else if (Number(inputPoint) > Number(currentPoint)) {
        alert("보유포인트를 확인해주세요");
      } else {
        const headers: any = {
          authorization: window.sessionStorage.getItem("accessToken"),
        };
        axios({
          method: "POST",
          url: "https://us-central1-npas-78659.cloudfunctions.net/api/withdrawal",
          headers,
          data: {
            type: "trx",
            point: inputPoint,
            address: address,
          },
        })
          .then((res) => {
            if (res.status === 201) {
              if (window.confirm("지갑주소 : " + address + "를 확인해주세요")) {
                alert("출금신청이 완료되었습니다.");
                setCurrentPoint(currentPoint - Number(inputPoint));
                setTimeout(() => {
                  router.push("/CoinList");
                }, 200);
              }
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              if (err.response.data.errCode === 101) {
                functions.refreshToken(coinWithdrawal);
              } else if (err.response.data.errCode === 611) {
                alert("보유 포인트를 확인해주세요.");
              }
            }
          });
      }
    }
  }

  function expectedTRX(point: any, trx: any) {
    point = point.replace(/,/g, "");
    point = Number(point);
    trx = Number(trx);
    let result = point / trx;
    result.toFixed(2);
    setExpect(Number(result));
  }

  useEffect(() => {
    let point = window.sessionStorage.getItem("point");
    setCurrentPoint(point);
    getTrxPrice();
    return () => getTrxPrice();
  }, []);

  return (
    <div className="coin-withdrawal">
      <div className="coin-withdrawal__content">
        <div className="coin-withdrawal__content__head">
          <div className="coin-withdrawal__content__head__title">
            코인 출금 신청
            <Link href="/Main">
              <img
                src="/images/close.png"
                alt="close"
                className="coin-withdrawal__content__head__close"
              />
            </Link>
          </div>
          <div className="coin-withdrawal__content__head__point">
            보유 포인트 : {functions.addComma(currentPoint)}P
          </div>
          <div className="coin-withdrawal__content__head__trans">
            1 TRX = {trx} POINT
          </div>
        </div>
        <div className="coin-withdrawal__content__body">
          <div className="coin-withdrawal__content__body__infobtn">
            <span>100,000이상부터 출금 가능합니다.</span>
            <button
              type="button"
              className="coin-withdrawal__content__body__btn"
              onClick={() => {
                coinWithdrawal();
                setAddress("");
                setPoint("");
                setExpect("");
              }}
            >
              출금하기
            </button>
          </div>
          <div className="coin-withdrawal__content__body__in">
            <div className="coin-withdrawal__content__body__in__title">
              입금 계좌
            </div>
            <input
              type="text"
              className="coin-withdrawal__content__body__in__input"
              placeholder="지갑주소를 입력해주세요."
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <div className="coin-withdrawal__content__body__out">
            <div className="coin-withdrawal__content__body__out__title">
              출금 금액
            </div>
            <input
              type="text"
              className="coin-withdrawal__content__body__out__input"
              onChange={(e) => {
                expectedTRX(e.target.value, trx);
                setPoint(e.target.value);
              }}
            />
            <div className="coin-withdrawal__content__body__out__expect">
              예상 : {expect} TRX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinWithdrawal;
