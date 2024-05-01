import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  console.log(user);
  // firebase 안에 있는 auth, 현재 유저 알려줌
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
  // children props는 component 내부의 모든 것, <Home/>, <Profile/>이 들어감
}

// 로그인한 사람은 protected-route를, 안 한 사람은 홈으로
