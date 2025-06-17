import React, { useState, useRef, useEffect, memo } from "react";
import { toast } from "sonner";
import { authService } from "../services/api";

// Modal bileşenini ayrı bir bileşen olarak çıkaralım
const ResetPasswordModal = memo(
  ({
    show,
    onClose,
    resetStep,
    phoneNumber,
    displayValue,
    verificationCode,
    newPassword,
    newPasswordConfirm,
    resetLoading,
    onPhoneChange,
    onVerificationCodeChange,
    onNewPasswordChange,
    onNewPasswordConfirmChange,
    onSubmit,
    onReset,
  }) => {
    const phoneInputRef = useRef(null);

    const handleFocus = () => {
      const input = phoneInputRef.current;
      if (input) {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    };

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Şifre Sıfırlama</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {resetStep === 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-gray-500">+90</span>
                  </div>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={displayValue}
                    onChange={onPhoneChange}
                    onFocus={handleFocus}
                    className="w-full outline-none pl-12 pr-3 py-2 border border-[#A2ACC7] rounded-lg"
                    placeholder="5XX XXX XX XX"
                    required
                    maxLength={12}
                    inputMode="numeric"
                    pattern="\d{3} \d{3} \d{2} \d{2}"
                  />
                </div>
              </div>
            )}

            {resetStep === 2 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Doğrulama Kodu
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={onVerificationCodeChange}
                  className="w-full outline-none px-3 py-2 border border-[#A2ACC7] rounded-lg"
                  placeholder="6 haneli kodu girin"
                  required
                />
              </div>
            )}

            {resetStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={onNewPasswordChange}
                    className="w-full outline-none px-3 py-2 border border-[#A2ACC7] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={onNewPasswordConfirmChange}
                    className="w-full outline-none px-3 py-2 border border-[#A2ACC7] rounded-lg"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReset();
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={resetLoading}
                className="px-4 py-2 bg-[#1C5540] text-white rounded-lg"
              >
                {resetLoading
                  ? "İşleniyor..."
                  : resetStep === 1
                  ? "Kod Gönder"
                  : resetStep === 2
                  ? "Doğrula"
                  : "Şifreyi Güncelle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

const SignIn = () => {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTekrar, setPasswordTekrar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [sozlesme, setSozlesme] = useState(false);
  const [rizaMetni, setRizaMetni] = useState(false);
  const [yeniKayit, setYeniKayit] = useState(false);

  // Şifre sıfırlama state'leri
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
        if (yeniKayit) {
          window.location.href = "/hesap/dogrula";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Giriş hatası:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordTekrar) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            kvkk_onay: kvkkOnay,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        setTab("login");
        setYeniKayit(true);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error) => {
            toast.error(error.message);
          });
        } else {
          toast.error(data.message || "Bir hata oluştu");
        }
      }
    } catch (error) {
      toast.error(error.message || "Bir hata oluştu");
      console.error("Kayıt hatası:", error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      if (resetStep === 1) {
        const response = await authService.sendResetCode(phoneNumber);
        if (response.data.success) {
          toast.success("Doğrulama kodu telefonunuza gönderildi");
          setResetStep(2);
        }
      } else if (resetStep === 2) {
        const response = await authService.verifyResetCode(
          phoneNumber,
          verificationCode
        );
        if (response.data.success) {
          setResetStep(3);
        }
      } else if (resetStep === 3) {
        if (newPassword !== newPasswordConfirm) {
          toast.error("Şifreler eşleşmiyor");
          return;
        }
        const response = await authService.resetPassword(
          phoneNumber,
          verificationCode,
          newPassword
        );
        if (response.data.success) {
          toast.success("Şifreniz başarıyla güncellendi");
          setShowResetModal(false);
          resetResetForm();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Bir hata oluştu");
    } finally {
      setResetLoading(false);
    }
  };

  const resetResetForm = () => {
    setResetStep(1);
    setPhoneNumber("");
    setDisplayValue("");
    setVerificationCode("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return number;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      setPhoneNumber(numbers);
      setDisplayValue(formatPhoneNumber(numbers));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:justify-normal lg:flex-row">
      <div className="w-full  bg-[#1C5540] relative hidden lg:flex items-center justify-center">
        <img src="/images/logo-500.png" />
        <div className="absolute text-white font-light montserrat items-center flex flex-col gap-1 bottom-5 right-1/2 translate-x-1/2">
          <p className="text-sm">© 2025 www.firmakutusu.com</p>
          <p className="text-sm">HEDA Teknoloji Bilişim A.Ş. markasıdır.</p>
          <p className="text-sm">Tüm hakları saklıdır.</p>
        </div>
      </div>
      <div className="lg:w-full xl:w-1/3 flex flex-col items-center justify-center">
        <img src="/images/diklogo.svg" alt="" />
        <div className="max-w-xs montserrat mx-auto w-full mt-8">
          <div className="flex w-full gap-1">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 flex items-center text-[#232323] font-medium justify-center gap-2 cursor-pointer hover:bg-[#DFFF00]/60 duration-300  w-full ${
                tab === "login" ? "bg-[#DFFF00]" : "bg-[#F1EEE6]"
              } rounded-l-xl h-[60px]`}
            >
              <img src="/images/icons/login.svg" alt="" />
              Giriş Yap
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 flex items-center text-[#232323] font-medium justify-center gap-2 cursor-pointer hover:bg-[#DFFF00]/60 duration-300  w-full ${
                tab === "register" ? "bg-[#DFFF00]" : "bg-[#F1EEE6]"
              } rounded-r-xl h-[60px]`}
            >
              <img src="/images/icons/kayit.svg" alt="" />
              Kayıt Ol
            </button>
          </div>

          <div className="w-full mt-3">
            {tab === "login" && (
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-3 items-center justify-center"
              >
                <div class="relative w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    class="block px-2.5 pb-2.5 font-semibold pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-[#A2ACC7] appearance-none focus:outline-none focus:ring-0 focus:border-[#A2ACC7] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="email"
                    class="absolute text-sm font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    E-Mail
                  </label>
                </div>
                <div class="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="sifre"
                    class="block px-2.5 font-semibold pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-[#A2ACC7] appearance-none focus:outline-none focus:ring-0 focus:border-[#A2ACC7] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="sifre"
                    class="absolute text-sm font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Şifre
                  </label>
                  <img
                    src="/images/icons/goster.svg"
                    alt="Şifreyi göster/gizle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="flex w-full text-sm items-center justify-between">
                  <div className="flex items-center gap-1">
                    <input
                      id="oturum"
                      type="checkbox"
                      className="w-4 h-4 accent-[#ddff00]"
                    />
                    <label htmlFor="oturum" className="text-[#232323]">
                      Oturum açık kalsın
                    </label>
                  </div>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="font-semibold text-[#120A8F] hover:underline"
                  >
                    Şifre Sıfırlama
                  </button>
                </div>
                <button
                  type="submit"
                  className="flex cursor-pointer h-[60px] w-full bg-[#1C5540] rounded-lg justify-center text-white font-semibold items-center gap-1"
                >
                  <img src="/images/icons/power.png" alt="" />
                  Giriş
                </button>
              </form>
            )}
            {tab === "register" && (
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-3 items-center justify-center"
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    class="block px-2.5 font-semibold pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-[#A2ACC7] appearance-none focus:outline-none focus:ring-0 focus:border-[#A2ACC7] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    class="absolute text-sm font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    E-Mail
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="sifre"
                    class="block px-2.5 pb-2.5 font-medium pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-[#A2ACC7] appearance-none focus:outline-none focus:ring-0 focus:border-[#A2ACC7] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="sifre"
                    class="absolute text-sm font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Şifre Belirleyin
                  </label>
                  <img
                    src="/images/icons/goster.svg"
                    alt="Şifreyi göster/gizle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordTekrar}
                    onChange={(e) => setPasswordTekrar(e.target.value)}
                    id="sifretekrar"
                    class="block px-2.5 pb-2.5 pt-4 font-medium w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-[#A2ACC7] appearance-none focus:outline-none focus:ring-0 focus:border-[#A2ACC7] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="sifretekrar"
                    class="absolute text-sm font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Şifreyi Tekrar Girin
                  </label>
                  <img
                    src="/images/icons/goster.svg"
                    alt="Şifreyi göster/gizle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="flex w-full text-xs flex-col gap-2">
                  <div className="flex items-start gap-1">
                    <input
                      id="kvkk"
                      type="checkbox"
                      required
                      onChange={() => setKvkkOnay(!kvkkOnay)}
                      className="w-3 h-3 mt-1 accent-[#ddff00]"
                    />
                    <label htmlFor="kvkk" className="text-[#232323]">
                      Kişisel verilerimin,{" "}
                      <span className="font-semibold">KVKK</span> Aydınlatma
                      Metni'nde belirtilen şekilde elde edilmesine, saklanmasına
                      ve işlenmesine açık rızamla onay veriyorum.
                    </label>
                  </div>
                  <div className="flex items-start gap-1">
                    <input
                      id="sozlesme"
                      type="checkbox"
                      onChange={() => setSozlesme(!sozlesme)}
                      className="w-3 h-3 mt-1 accent-[#ddff00]"
                      required
                    />
                    <label htmlFor="sozlesme" className="text-[#232323]">
                      FirmaKutusu.com Üyelik Sözleşmesi'ni ve Gizlilik
                      Politikası'nı okudum, kabul ediyorum.
                    </label>
                  </div>
                  <div className="flex items-start gap-1">
                    <input
                      id="riza"
                      type="checkbox"
                      onChange={() => setRizaMetni(!rizaMetni)}
                      className="w-3 h-3 mt-1 accent-[#ddff00]"
                      required
                    />
                    <label htmlFor="riza" className="text-[#232323]">
                      Aydınlatma ve rıza metnini kabul ediyorum ve iletişim
                      bilgilerimin paylaşılmasını ve tarafıma elektronik ileti
                      gönderilmesini onaylıyorum.
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex cursor-pointer h-[60px] w-full bg-[#1C5540] rounded-lg justify-center text-white font-semibold items-center gap-1"
                >
                  <img src="/images/icons/power.png" alt="" />
                  Kayıt Ol
                </button>
              </form>
            )}
            <div className="mt-7 flex flex-col w-full gap-2">
              <button className="flex h-[60px] w-full rounded-lg border border-[#A2ACC7] items-center justify-center gap-2">
                <img src="/images/icons/google.svg" alt="" />
                Google ile Devam Et
              </button>
              <button className="flex h-[60px] w-full rounded-lg border border-[#A2ACC7] items-center justify-center gap-2">
                <img src="/images/icons/apple.svg" alt="" />
                Apple ile Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
      <ResetPasswordModal
        show={showResetModal}
        onClose={() => setShowResetModal(false)}
        resetStep={resetStep}
        phoneNumber={phoneNumber}
        displayValue={displayValue}
        verificationCode={verificationCode}
        newPassword={newPassword}
        newPasswordConfirm={newPasswordConfirm}
        resetLoading={resetLoading}
        onPhoneChange={handlePhoneChange}
        onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
        onNewPasswordChange={(e) => setNewPassword(e.target.value)}
        onNewPasswordConfirmChange={(e) =>
          setNewPasswordConfirm(e.target.value)
        }
        onSubmit={handleResetPassword}
        onReset={resetResetForm}
      />
    </div>
  );
};

export default SignIn;
