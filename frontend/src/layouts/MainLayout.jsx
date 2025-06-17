import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { isLogin, user, logout } = useAuth();

  return (
    <AuthProvider>
      <main className="flex-grow">{children}</main>
    </AuthProvider>
  );
};

export default MainLayout;
