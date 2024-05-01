import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // input당 state 4개 별로다...
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    // if(target.name)
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 새로고침 x
    setError(""); // 버튼 2번 클릭하면 에러메시지 초기화
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 성공하면 userCredential 받아서 즉시 로그인
      console.log(credentials.user);
      await updateProfile(credentials.user, { displayName: name });
      // 유저명, 프로필 사진
      navigate("/");
      // redirect to the home page
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
        // 콘솔로그 err만 하면 FireBaseError라는 클래스가 나옴
        // code, message가 있음
        // setError 상태로 에러메시지 Error 컴포넌트에 띄움
      }

      // err.code 이용해서 사용자가 볼 수 있는 친절한 오류메시지 객체 만들기
      // {auth/email-already-in-use : 이미 사용중인 이메일}
    } finally {
      setLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join twitter</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          onChange={onChange}
          required
        />
        <Input
          name="email"
          value={email}
          placeholder="email"
          type="email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="password"
          type="password"
          onChange={onChange}
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
