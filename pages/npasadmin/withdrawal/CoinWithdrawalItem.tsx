import axios from "axios";
import router from "next/router";
import React, { useState } from "react";
import functions from "../../../lib/functions";

const CoinWithdrawalItem = (props: any) => {
  const [detail, setDetail] = useState(false);
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");

  let status = props.status;
  switch (status) {
    case 101:
      status = "신청중";
      break;
    case 102:
      status = "승인완료";
      break;
    case 109:
      status = "승인거절";
      break;
  }

  function approval(num: number) {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "PATCH",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/withdrawal",
      headers,
      data:
        num === 1
          ? {
              seq: props.seq,
              status: "102",
              type: "trx",
              email: props.email,
              amount: amount,
              txid: txid,
              address: props.address,
            }
          : {
              seq: props.seq,
              status: "109",
              type: "trx",
              email: props.email,
            },
    })
      .then((res) => {
        if (res.status === 200) {
          if (num === 1) {
            if (window.confirm("승인하시겠습니까?")) {
              alert("승인처리가 완료되었습니다.");
              router.reload();
            }
          } else if (num === 9) {
            if (window.confirm("거절하시겠습니까?")) {
              alert("거절처리가 완료되었습니다.");
              router.reload();
            }
          }
        }
      })
      .catch((err) => {
        if (err.response.data.errCode === 101) {
          functions.refreshToken(approval);
        } else if (err.response.data.errCode === 601) {
          alert("tx id와 코인의 개수를 입력해주세요.");
        }
      });
  }

  // function reject() {
  //   const headers: any = {
  //     authorization: window.sessionStorage.getItem("accessToken"),
  //   };
  //   axios({
  //     method: "PATCH",
  //     url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/withdrawal",
  //     headers,
  //     data: {
  //       seq: props.seq,
  //       status: "109",
  //       type: "trx",
  //       email: props.email,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         console.log(res);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response.status === 401) {
  //         if (err.response.data.errCode === 101) {
  //           functions.refreshToken(reject);
  //         }
  //       }
  //     });
  // }

  return (
    <React.Fragment>
      <tr
        className="admin-coin-withdrawal-table__tbody__tr"
        onClick={() => {
          setDetail(!detail);
        }}
      >
        <td>{props.seq}</td>
        <td>{props.email}</td>
        <td>{props.point}</td>
        <td>{status}</td>
        <td>{props.created}</td>
      </tr>
      {props.status === 101 ? (
        <tr
          className={
            detail
              ? "admin-coin-withdrawal-table__tbody__tr--detail"
              : "admin-coin-withdrawal-table__tbody__tr--detail__none"
          }
        >
          <td
            colSpan={4}
            className="admin-coin-withdrawal-table__tbody__tr--detail__info"
          >
            지갑주소 : {props.address} <br />
            코인개수 : {props.amount}
            <br />
            tx ID :{props.txid}
            <input
              type="text"
              placeholder="tx ID를 입력해 주세요."
              onChange={(e) => {
                setTxid(e.target.value);
              }}
            />
          </td>
          <td>
            * 코인개수는 소수점 2자리까지 입력 가능합니다.
            <input
              type="number"
              step="0.01"
              placeholder="전송한 코인의 개수를 입력하세요."
              className="admin-coin-withdrawal-table__tbody__tr--detail__input"
              value={amount}
              onChange={(e) => {
                const pattern = /^(\d{0,10}([.]\d{0,2})?)?$/;
                if (pattern.test(e.target.value)) {
                  setAmount(e.target.value);
                }
              }}
            />
            <button
              type="button"
              className="admin-coin-withdrawal-table__tbody__tr--detail__approval"
              onClick={() => {
                approval(1);
              }}
            >
              승인
            </button>
            <button
              type="button"
              className="admin-coin-withdrawal-table__tbody__tr--detail__reject"
              onClick={() => {
                approval(9);
              }}
            >
              거절
            </button>
          </td>
        </tr>
      ) : (
        <tr
          className={
            detail
              ? "admin-coin-withdrawal-table__tbody__tr--detail"
              : "admin-coin-withdrawal-table__tbody__tr--detail__none"
          }
        >
          <td
            colSpan={5}
            className="admin-coin-withdrawal-table__tbody__tr--detail__info"
          >
            지갑주소 : {props.address} <br />
            신청포인트 : {props.amount}
            <br />
            tx ID :
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default CoinWithdrawalItem;
