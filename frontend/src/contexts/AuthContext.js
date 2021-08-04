import { createContext, useEffect, useState } from "react";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function helper() {
      await updateUser()
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          throw new Error("No user found");
        });
    })();
  }, []);

  async function updateUser() {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/user`);

    try {
      const data = await res.json();
      if (data.statusCode === 500) {
        throw new Error("No user found");
      }
      setCurrentUser(data);
      setLoading(false);
    } catch (e) {
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
