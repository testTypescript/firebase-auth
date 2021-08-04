import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (passwordRef.current.value !== confirmRef.current.value) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const body = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/signup`,
        {
          method: "post",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (res.status === 200) {
        history.push("/login");
        return;
      } else {
        throw new Error();
      }
    } catch {
      setError("Failed to create account");
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label>Email</label>
        <input type="email" required ref={emailRef} />
        <label>Password</label>
        <input type="password" required ref={passwordRef} />
        <label>Confirm Password</label>
        <input type="password" required ref={confirmRef} />
        <button disabled={loading} type="submit">
          Sign Up
        </button>
      </form>
      <Link to="/login">Log in!</Link>
    </>
  );
}

export default Signup;
