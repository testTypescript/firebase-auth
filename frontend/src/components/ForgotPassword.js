import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const emailRef = useRef();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    setMessage("");
    e.preventDefault();

    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/reset-password`,
      {
        method: "post",
        body: JSON.stringify({ email: emailRef.current.value }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(res);
    if (res.status !== 200) {
      setMessage("User not found");
    } else {
      setMessage("Sent to your email!");
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {message && <p>{message}</p>}
        <label>Email</label>
        <input type="email" required ref={emailRef} />
        <button disabled={loading} type="submit">
          Reset
        </button>
      </form>
      <Link to="/login">Login</Link>
    </>
  );
}

export default ForgotPassword;
