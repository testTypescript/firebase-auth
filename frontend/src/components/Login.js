import { useRef, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { login, sessionLogin, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      returnSecureToken: true,
    };

    try {
      setLoading(true);

      const res = await login(body);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message);
      }

      const reply = await sessionLogin(data);

      if (!reply.ok) {
        throw new Error("Failed to create session");
      }

      const userData = await reply.json();
      setCurrentUser(userData.user);

      history.push("/");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }
  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label>Email</label>
        <input type="email" required ref={emailRef} />
        <label>Password</label>
        <input type="password" required ref={passwordRef} />
        <button disabled={loading} type="submit">
          Login
        </button>
      </form>
      <Link to="/forgot-password">Forgot Password</Link>
      <div>
        No account? <Link to="/signup">Sign up here</Link>
      </div>
    </>
  );
}

export default Login;
