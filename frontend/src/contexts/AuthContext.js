import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signup(body) {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  function login(body) {
    return fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${[
        process.env.FIREBASE_REST_API_KEY,
      ]}`,
      {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  function sessionLogin(data) {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/auth/sessionlogin`, {
      method: "post",
      body: JSON.stringify({
        idToken: data.idToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  function verify() {
    let v = document.cookie.match("(^|;) ?csrfToken=([^;]*)(;|$)");
    if (v.length) {
      v = v[2];
    } else {
      v = null;
    }
    return fetch(`${process.env.REACT_APP_SERVER_URL}/auth/verify`, {
      method: "post",
      body: JSON.stringify({
        csrfToken: v,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  function logout() {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/auth/sessionlogout`, {
      credentials: "include",
    });
  }

  function editProfile(password) {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/auth/edit-profile`, {
      method: "post",
      body: JSON.stringify({ uid: currentUser.uid, password: password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });
  }
  function forgotPassword(email) {
    return fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_REST_API_KEY}`,
      {
        method: "post",
        body: JSON.stringify({ email: email, requestType: "PASSWORD_RESET" }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const value = {
    currentUser,
    setCurrentUser,
    signup,
    login,
    sessionLogin,
    verify,
    logout,
    editProfile,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
