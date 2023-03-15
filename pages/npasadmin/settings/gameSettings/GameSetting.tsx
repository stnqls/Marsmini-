import axios from "axios";
import { useEffect, useState } from "react";
import functions from "../../../../lib/functions";
import "./GameSetting.scss";

const GameSetting = () => {
  const [point, setPoint] = useState("");
  const [probability, setProbability] = useState("");

  const [chPoint, setChPoint] = useState("");
  const [chProbability, setChProbability] = useState("");

  function getPoint() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/settings/point",
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setPoint(res.data.p_point);
          setProbability(res.data.probability);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(getPoint);
          }
        }
      });
  }

  function changePoint() {
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "PATCH",
      url: "https://us-central1-npas-78659.cloudfunctions.net/api/admin/settings/point",
      headers,
      data: {
        probability: chProbability,
        p_point: chPoint,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          alert("변경이 완료되었습니다.");
          setPoint(res.data.p_point);
          setProbability(res.data.probability);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.errCode === 101) {
            functions.refreshToken(changePoint);
          }
        }
      });
  }

  useEffect(() => {
    getPoint();
  }, []);

  function checkNumber(number: any) {
    if (number >= 0 && number <= 100) {
      let regexp = /^\d*.?\d{0,2}$/;
      if (!regexp.test(number)) {
        alert("소수점 둘째자리까지 입력가능합니다.");
      } else {
        setChProbability(number);
      }
    } else {
      alert("범위는 0~100까지 입니다.");
    }
  }

  return (
    <div className="admin-game">
      <div className="admin-game-show">
        <div className="admin-game-show__top">현재 포인트 설정</div>
        <div className="admin-game-show__content">
          <div className="admin-game-show__content__point">
            지금 포인트 : {point}
          </div>
          <div className="admin-game-show__content__percentage">
            포인트 확률 : {probability} %
          </div>
        </div>
      </div>
      <div className="admin-game-change">
        <div className="admin-game-change__top">
          <span>변경 포인트 설정</span>
          <button
            type="button"
            className="admin-game-change__top__btn"
            onClick={() => {
              changePoint();
            }}
          >
            변경하기
          </button>
        </div>
        <div className="admin-game-change__content">
          <div className="admin-game-change__content__point">
            지금 포인트
            <input
              type="number"
              className="admin-game-change__content__point__input"
              onChange={(e) => {
                setChPoint(e.target.value);
              }}
            />
          </div>
          <div className="admin-game-change__content__percentage">
            포인트 확률
            <input
              type="number"
              className="admin-game-change__content__percentage__input"
              step="0.01"
              onChange={(e) => {
                checkNumber(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetting;
