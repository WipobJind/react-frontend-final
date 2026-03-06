import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({children}) {

  const initialUser = JSON.parse(localStorage.getItem("session")) ?? {
    isLoggedIn: false,
    name: '',
    email: '',
    role: ''
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(initialUser);

  const login = async (email, password) => {
    try {
      const result = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (result.status !== 200) {
        return false;
      }

      const profileRes = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      const profileData = await profileRes.json();

      const newUser = {
        isLoggedIn: true,
        name: profileData.username || '',
        email: email,
        role: profileData.role || 'USER'
      };
      setUser(newUser);
      localStorage.setItem("session", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.log("Login Exception: ", error);
      return false;
    }
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include"
    });
    const newUser = { isLoggedIn: false, name: '', email: '', role: '' };
    setUser(newUser);
    localStorage.setItem("session", JSON.stringify(newUser));
  }

  return (
    <UserContext.Provider value={{user, login, logout}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}