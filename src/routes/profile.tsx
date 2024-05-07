import { useState, useEffect } from "react";
import styled from "styled-components";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 60px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const NameEditContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const NameEditInput = styled.input`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  width: 200px;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const NameEditButton = styled.button`
  background-color: #000;
  color: #1d9bf0;
  font-weight: 600;
  border: 1px solid #1d9bf0;
  width: 68px;
  height: 28px;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [nameEditing, setNameEditing] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      // tweets 말고 avatars 폴더 따로
      // 유저당 아바타 이미지는 하나, 한 파일 계속 덮어쓰며 사용
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const ToggleNameEdit = () => setNameEditing(!nameEditing);

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    // value, name 한 글자씩 차이나던 이유: value는 input에 입력된 값, name은 state에 저장된 값
    // setState는 비동기로 작동, name의 업데이트가 즉시 발생하지 않음
    // value 호출 직후에 name 호출하면 아직 최신 value가 반영 안 된 name을 출력하게 됨
  };

  const editName = async () => {
    if (!user) return;
    await updateProfile(user, { displayName: name });
    ToggleNameEdit();
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      // The query requires an index. 인덱스가 뭘까
      // Firestore db 너무 유연함, 어떤 구조로든 데이터 넣을 수 있음
      // 그냥 데이터 가져오기 말고 조건 만들려면 Firebase에 어떤 필터링 할지 알려줘야 함
      // 에러메시지로 firebase url 알려줌, 클릭해서 저장하면 끝
      orderBy("createdAt", "desc"),
      limit(25)
    );
    // 유저 id가 현재 로그인한 유저 id와 같은 트윗들만 가져옴

    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {/* label은 input 의미 알려주는 용도, onChange는 input에 줘야 함 */}
      <Name>
        {nameEditing ? (
          <NameEditContainer>
            <NameEditInput
              value={name}
              placeholder="Edit Name"
              type="text"
              onChange={handleNameChange}
            />
            <NameEditButton onClick={editName}>Edit</NameEditButton>
          </NameEditContainer>
        ) : (
          user?.displayName ?? "Anonymous"
        )}

        {/* ?? : Nullish Coalescing Operator, A가 null이거나 unidentified면 B로 해라 */}
      </Name>
      <NameEditButton onClick={ToggleNameEdit}>
        {nameEditing ? "Cancel" : "Edit"}
      </NameEditButton>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
