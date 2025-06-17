import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignIn from "@pages/SignIn";
import Home from "./pages/Home";
import Loader from "./layout/Loader";
import FirmaAra from "./pages/FirmaAra";
import FirmaProfil from "./pages/FirmaProfil";
import Paketler from "./pages/Paketler";
import Hakkimizda from "./pages/Hakkimizda";
import Blog from "./pages/Blog";
import Destek from "./pages/Destek";
import Sponsorluk from "./pages/Sponsorluk";
import Dogrulama from "./pages/auth/Dogrulama";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import UserLayout from "./layouts/UserLayout";
import Profil from "./pages/panel/Profil";
import HesapBlog from "./pages/panel/Blog";
import Favorilerim from "./pages/panel/Favorilerim";
import Paketlerim from "./pages/panel/Paketlerim";
import FirmaAraHesap from "./pages/panel/FirmaAra";
import DestekHesap from "./pages/panel/Destek";
import Ayarlar from "./pages/panel/Ayarlar";
import Bildirimler from "./pages/panel/Bildirimler";
import { Toaster } from "sonner";
import Basarili from "./pages/odeme/Basarili";
import Basarisiz from "./pages/odeme/Basarisiz";
import Faturalarim from "./pages/panel/Faturalarim";

const ProtectedRoute = ({ children }) => {
  const { loading, isLogin, user } = useAuth();

  if (loading) return null;
  if (!isLogin || !user) return <Navigate to="/hesap/giris-kayit" replace />;

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">{loading && <Loader />}</AnimatePresence>
      <Toaster position="top-center" richColors />
      {!loading && (
        <AuthProvider>
          <MainLayout>
            <BrowserRouter>
              <Routes>
                <Route path="/hesap/giris-kayit" element={<SignIn />} />
                <Route
                  path="/hesap/dogrula"
                  element={
                    <ProtectedRoute>
                      <Dogrulama />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/profil"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Profil />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/blog"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <HesapBlog />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/favorilerim"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Favorilerim />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/paketlerim"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Paketlerim />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/firma-ara"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <FirmaAraHesap />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/ayarlar"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Ayarlar />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/destek"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <DestekHesap />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/bildirimler"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Bildirimler />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hesap/faturalarim"
                  element={
                    <ProtectedRoute>
                      <UserLayout>
                        <Faturalarim />
                      </UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Home />} />
                <Route path="/firma/:id" element={<FirmaProfil />} />
                <Route path="/paketler" element={<Paketler />} />
                <Route path="/hakkimizda" element={<Hakkimizda />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/destek" element={<Destek />} />
                <Route path="/sponsorluk" element={<Sponsorluk />} />
                <Route path="/odeme/basarili" element={<Basarili />} />
                <Route path="/odeme/basarisiz" element={<Basarisiz />} />
              </Routes>
            </BrowserRouter>
          </MainLayout>
        </AuthProvider>
      )}
    </>
  );
};

export default App;
