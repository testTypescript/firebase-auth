import { createContext, useEffect, useState } from "react";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function helper() {
      await updateUser().finally(() => setLoading(false));
    })();
  }, []);

  async function updateUser() {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/user`);
      const data = await res.json();
      if (data.statusCode === 500) {
        throw new Error("No user found");
      }
      setCurrentUser(data);
    } catch (e) {
      setCurrentUser(null);
      console.log(e);
    }
  }

  const value = {
    currentUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
