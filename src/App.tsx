import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      // layout과 Home이 모든 경로와 연결된다
      {
        path: "profile",
        element: <Profile />,
        // /profile 경로에 가면 layout과 profile이 차례로 나온다
        // Home, Profile은 Layout 내부에서 렌더링됨
      },
    ],
  },

  // 로그인, 계정만들기 route가 Layout 안에 안 들어갔으면 좋겠다?
  // Layout은 이미 로그인한 유저만 사용하도록
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  
  *{
    box-sizing: border-box;
  }

  body{
    background-color: #000;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    // 최초 인증상태 완료될 때 실행되는 Promise를 return
    // firebase가 쿠키, 토큰 읽고 백엔드와 소통해서 로그인여부 확인할 때까지 기다림
    setLoading(false);
    // setTimeout(() => setIsLoading(false), 2000);
    // 실제로 Firebase 로딩 빠름, 2초동안 볼 일 없음
  };

  useEffect(() => {
    init();
  }, []);

  // 사용자에게 로딩 화면 표시

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
