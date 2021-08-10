import { useRef, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { signup } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (passwordRef.current.value !== confirmRef.current.value) {
      setError("Passwords do not match");
      return;
    }

    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      setLoading(true);

      const res = await signup(body);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      history.push("/login");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
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
