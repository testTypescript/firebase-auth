import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Dashboard() {
  const { currentUser, setCurrentUser, verify, logout } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    verify()
      .then((res) => {
        if (!res.ok) {
          throw Error(res.message);
        }
        res
          .json()
          .then((data) => {
            setCurrentUser(data.user);
            setLoading(false);
          })
          .catch(() => {
            history.push("/login");
          });
      })
      .catch(() => {
        history.push("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClick(e) {
    e.preventDefault();
    await logout();
    history.push("/login");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Dashboard</h2>
      {currentUser && currentUser.email}
      <Link to="/edit-profile">Update profile</Link>
      <button disabled={loading} onClick={handleClick}>
        Log out
      </button>
    </>
  );
}

export default Dashboard;
