import { useState } from "react";
import functions from "../../lib/functions";

const CoinListItem = (props: any) => {
  const [transId, setTransId] = useState("");

  function status(number: any) {
    switch (number) {
      case 101:
        return "신청중";
      case 102:
        return "완료";
      case 109:
        return "거절";
    }
  }

  return (
    <li className="coin-list__content__body__list__item">
      <div className="coin-list__content__body__list__item__top">
        <div className="coin-list__content__body__list__item__money">
          {props.amount}TRX ({functions.addComma(props.point)})
        </div>
        <div className="coin-list__content__body__list__item__status">
          {status(props.status)}
        </div>
      </div>
      <div className="coin-list__content__body__list__item__address">
        {props.address}
      </div>
      <div className="coin-list__content__body__list__item__txid">
        <a
          href={`https://tronscan.org/#/transaction/${transId}`}
          target="_blank"
          onClick={() => {
            setTransId(props.txid);
          }}
        >
          {props.txid}
        </a>
      </div>
      <div className="coin-list__content__body__list__item__date">
        {props.created}
      </div>
    </li>
  );
};

export default CoinListItem;
