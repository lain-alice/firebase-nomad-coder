import { useNavigate } from "react-router-dom";
import { GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";

const Button = styled.span`
  background-color: #fff;
  font-weight: 600;
  width: 100%;
  color: #000;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithRedirect(auth, provider);
      // await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg"></Logo>
    </Button>
  );
}
