import { useState } from "react";
import styled from "styled-components";
import { auth, storage, db } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid #fff;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  width: 100%;
  resize: none;
  /* textarea는 기본적으로 resize 가능 */
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttatchFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttatchFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: #fff;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 파일 하나만 업로드하고 싶음, file이 존재하고 갯수 1개인지
      if (files[0].size > maxFileSize) {
        alert("10MB 이하의 파일만 업로드 가능합니다.");
        return;
      }

      setFile(files[0]); // 파일 배열의 첫번째 요소
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    // 로그인되어있지 않거나 트윗 내용이 없거나 180자 이상이면 함수 kill

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        // Firebase SDK의 addDoc 함수, Firestore 인스턴스와 컬렉션 이름
        // doc 참조를 Promise 형태로 반환
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        // 유저 닉네임, 없으면 Anonymous
        userId: user.uid,
        // 작성자 본인만 트윗 삭제하기 위해 유저 아이디 확인
      });
      if (file) {
        // 유저가 업로드하는 이미지 파일 있으면(필수 아님)
        const locationRef = ref(
          storage,
          `tweets/{${user.uid}}-${user.displayName}/${doc.id}`
          // 업로드한 이미지 저장되는 폴더명, 파일명
          // 유저마다 파일 저장하는 고유 폴더 하나씩 생성
        );
        const result = await uploadBytes(locationRef, file);
        // 이미지를 storage에 업로드
        const url = await getDownloadURL(result.ref);
        // 이미지의 url string 반환하는 Promise
        await updateDoc(doc, { photo: url });
        // 업데이트할 document 참조, 업데이트할 데이터
        // 트윗 doc에 이미지 url 저장
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?"
        required
      />
      <AttatchFileButton htmlFor="file">
        {file ? "Photo Added!" : "Add Photo"}
      </AttatchFileButton>
      {/* htmlFor와 id 같다면 label 눌렀을 때 id=file 버튼 클릭됨 */}
      <AttatchFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
        // 이미지 파일, 모든 확장자
      />
      {/* 이 input은 스타일링하기 어려우니 숨기고 위의 label을 꾸민다 */}
      {/* 타입이 file인 input이 변경될 때마다 파일의 배열을 받는다 */}
      <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"} />
    </Form>
  );
}
