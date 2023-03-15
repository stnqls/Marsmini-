const axios = require("axios");

const refreshToken = (recall) => {
  axios({
    method: "POST",
    url: `https://securetoken.googleapis.com/v1/token?key=AIzaSyAhMgEFzJxWOLvBr77HCeERUOSnSLFC5m8`,
    data: {
      grant_type: "refresh_token",
      refresh_token: window.sessionStorage.getItem("refresh"),
    },
  })
    .then((res) => {
      window.sessionStorage.setItem("accessToken", res.data.access_token);
      window.sessionStorage.setItem("token", res.data.id_token);
      window.sessionStorage.setItem("refresh", res.data.refresh_token);
      recall();
    })

    .catch((err) => {
      alert("서버 인증 중 문제가 발생했습니다. 다시 로그인 후 이용해주세요.");
    });
};

const addComma = (target) => {
  if (Number(target) !== 0) {
    return String(target)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return target;
  }
};

module.exports = {
  refreshToken,
  addComma,
};
