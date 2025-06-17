import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/hesap/giris-kayit");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Bir hata oluştu");
        }

        const { user } = data;

        if (!user.aktif) {
          toast.error("Hesabınız pasif duruma çekilmiştir");
          navigate("/hesap/giris-kayit");
          return;
        }

        if (!user.yetkili_kisi_id) {
          toast.warning("Hesabınızı doğrulamanız gerekmektedir");
          navigate("/hesap/dogrula");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Oturum doğrulanamadı:", error);
        toast.error(error.message || "Oturum doğrulama hatası");
        navigate("/hesap/giris-kayit");
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return <>{children}</>;
};

export default UserLayout;
