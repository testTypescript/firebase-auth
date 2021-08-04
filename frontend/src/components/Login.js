import { useRef, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { updateUser } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const body = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
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
        await updateUser();
        history.push("/");
        return;
      } else {
        throw new Error();
      }
    } catch {
      setError("User not found");
    }
    setLoading(false);
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
