import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./features/signUp/SignUp";
import Login from "./features/login/Login";
import Landing from "./features/landingPage/LandingPage";
import Verifyotp from "./features/signUp/components/ConfirmPhone";
import ResetPassword from "./features/login/components/ResetPassword";
import UpdatePassword from "./features/login/components/UpdatePassword";
import AEPocLogin from "./features/login/aepocLogin/AepocLogin";
import OtpVerification from "./features/login/aepocLogin/OtpVerification";
import ForbiddenErrorPage from "./common/component/ForbiddenErrorPage";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
function App() {
    const has403 = useSelector((state: RootState) => state.forbidden.has403);
  if (has403) {
  return (
    <BrowserRouter>
      <ForbiddenErrorPage />
    </BrowserRouter>
  );
}

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/verify-otp" element={<Verifyotp />} />
          <Route path="/landing/*" element={<Landing />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/update-password/" element={<UpdatePassword />} />
          <Route path="/aepoc-login" element={<AEPocLogin />} />
          <Route path="/aepoc-otp" element={<OtpVerification />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
