import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Dashboard() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleClick(e) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/signout`
      );
      if (res.status === 200) {
        setLoading(false);
        history.push("/login");
        await updateUser();
        return;
      } else {
        throw new Error();
      }
    } catch {
      setError("Error signing out");
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Dashboard</h2>
      {currentUser.user.email}
      {error && <p>{error}</p>}
      <Link to="/edit-profile">Update profile</Link>
      <button disabled={loading} onClick={handleClick}>
        Log out
      </button>
    </>
  );
}

export default Dashboard;
