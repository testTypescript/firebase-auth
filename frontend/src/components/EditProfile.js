import { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function EditProfile() {
  const { verify, editProfile, setCurrentUser } = useContext(AuthContext);
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    verify()
      .then((res) => {
        if (!res.ok) {
          throw Error(res.message);
        }
        setLoading(false);
      })
      .catch(() => {
        history.push("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (passwordRef.current.value !== confirmRef.current.value) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await editProfile(passwordRef.current.value);
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
    } else {
      setMessage("Password has been reset!");
      setCurrentUser(data.user);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {message && <p>{message}</p>}
        <label>Password</label>
        <input
          type="password"
          placeholder="Leave blank to not update"
          ref={passwordRef}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Leave blank to not update"
          ref={confirmRef}
        />
        <button type="submit">Update</button>
      </form>
      <Link to="/">Back to dashboard</Link>
    </>
  );
}

export default EditProfile;
