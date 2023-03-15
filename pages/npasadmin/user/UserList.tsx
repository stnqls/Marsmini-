import axios from "axios";
import { useEffect, useState } from "react";
import functions from "../../../lib/functions";
import Pagination from "react-js-pagination";

import InvitationModal from "../modal/invited/InvitationModal";
import PointModal from "../modal/point/PointModal";
import UserListItem from "./UserListItem";
import "./UserList.scss";

const UserList = () => {
  const [data, setData] = useState([]);
  const [userCode, setUserCode] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [search, setSearch] = useState("");
  const [pointModal, setPointModal] = useState(false);
  const [invitationModal, setInvitationModal] = useState(false);

  function getUsers(activePage: number) {
    setPage(activePage);
    const headers: any = {
      authorization: window.sessionStorage.getItem("accessToken"),
    };
    axios({
      method: "GET",
      url: `https://us-central1-npas-78659.cloudfunctions.net/api/admin/users?page=${activePage}&search=${search}`,
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.rows);
          setTotalPage(res.data.count);
        }
      })
      .catch((err) => {
        if (err.response.data.errCode === 101) {
          functions.refreshToken(getUsers);
        }
      });
  }

  useEffect(() => {
    getUsers(1);
    setPage(1);
  }, [search]);

  return (
    <div className="admin-user-list">
      <div className="admin-user-list__head">
        <input
          type="text"
          className="admin-user-list__head__search"
          placeholder="E-mail로 검색하기"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="admin-user-list__body">
        <table className="admin-user-list-table">
          <thead className="admin-user-list-table__head">
            <tr className="admin-user-list-table__head__tr">
              <td className="admin-user-list-table__head__tr__edit">Edit</td>
              <td>UserCode</td>
              <td className="admin-user-list-table__head__tr__email">E-mail</td>
              <td className="admin-user-list-table__head__tr__point">Point</td>
              <td>Details</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody className="admin-user-list-table__body">
            {data &&
              data.length > 0 &&
              data.map((item: any, index: number) => (
                <UserListItem
                  key={`admin-user-list-${index}`}
                  created={item.created}
                  email={item.email}
                  point={item.point}
                  user_code={item.user_code}
                  setUserCode={setUserCode}
                  setPointModal={setPointModal}
                  setInvitationModal={setInvitationModal}
                />
              ))}
          </tbody>
        </table>
        {data && data.length > 0 && (
          <Pagination
            totalItemsCount={totalPage}
            activePage={page}
            onChange={getUsers} //페이지가 바뀔때 핸들링해줄 함수
            prevPageText={"<"} //이전을 나타낼 텍스트
            nextPageText={">"}
            firstPageText={""}
            lastPageText={""}
          />
        )}
      </div>
      {pointModal && (
        <PointModal setPointModal={setPointModal} userCode={userCode} />
      )}
      {invitationModal && (
        <InvitationModal
          setInvitationModal={setInvitationModal}
          userCode={userCode}
        />
      )}
    </div>
  );
};

export default UserList;
