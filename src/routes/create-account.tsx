import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  color: tomato;
  text-align: center;
  font-weight: 600;
`;

export default function CreateAccount() {
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 새로고침 x
    try {
      // create an account
      // set the name of user
      // redirect to the home page
    } catch (e) {
      // error
    } finally {
      setLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Log into twitter</Title>
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
          value={isLoading ? "Loading..." : "Create Accoung"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
