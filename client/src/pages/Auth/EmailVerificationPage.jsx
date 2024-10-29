import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Home/Header';
import { useAuthStore } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const { error, verifyEmail, isAuthenticated, isLoading } = useAuthStore();

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (new RegExp(`^[0-9]{6}$`).test(text)) {
      const newOtp = text.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying email");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow mt-20">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">OTP Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 6-digit verification code that was sent to your registered email.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{' '}
          <span className="font-medium text-indigo-500 hover:text-indigo-600">
            Resend Code
          </span>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default EmailVerificationPage;
