import { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ForgotPassword() {
  const emailRef = useRef();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  async function handleSubmit(e) {
    setMessage("");
    e.preventDefault();

    setLoading(true);
    const res = await forgotPassword(emailRef.current.value);
    if (!res.ok) {
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
