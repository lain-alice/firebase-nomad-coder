import { Outlet } from "react-router-dom";
// layout 다음에 Home 나옴, 모든 페이지에 layout 적용

export default function Layout() {
  return (
    <>
      <Outlet />
      {/* 경로가 /profile이면 Outlet 컴포넌트가 Profile로 대체됨 */}
    </>
  );
}
