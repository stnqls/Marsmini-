import GameSetting from "./gameSettings/GameSetting";
import NoticeSetting from "./noticeSetting/NoticeSetting";
import "./Setting.scss";

const Setting = () => {
  return (
    <div className="admin-setting">
      <GameSetting />
      <NoticeSetting />
    </div>
  );
};

export default Setting;
