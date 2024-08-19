import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage, SendMoneyPage, SignInPage, SignUpPage } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/send" element={<SendMoneyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
