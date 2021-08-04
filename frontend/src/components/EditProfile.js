import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function EditProfile() {
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (passwordRef.current.value !== confirmRef.current.value) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/edit-password`,
      {
        method: "post",
        body: JSON.stringify({ password: passwordRef.current.value }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (res.status !== 200) {
      setMessage("User not found");
    } else {
      setMessage("Password has been reset!");
    }

    setLoading(false);
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
        <button disabled={loading} type="submit">
          Update
        </button>
      </form>
      <Link to="/">Back to dashboard</Link>
    </>
  );
}

export default EditProfile;
