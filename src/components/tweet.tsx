import { ITweet } from "./timeline";
import styled from "styled-components";
import { auth, storage, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import EditTweetForm from "./edit-tweet-form";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 5px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  background-color: #000;
  color: tomato;
  font-weight: 600;
  border: 1px solid tomato;
  width: 68px;
  height: 28px;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
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

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);

  const onDelete = async () => {
    const ok = confirm("정말 트윗을 삭제하시겠습니까?");

    if (!ok || user?.uid !== userId) return; // 로그인, 작성자 id 다르면 바로 종료
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        // 트윗에 사진이 있다면
        const photoRef = ref(storage, `tweets/{${user.uid}}/${id}`); // 경로로 사진 파일 참조
        await deleteObject(photoRef); // 참조된 사진 삭제
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };
  const onEdit = () => setIsEditing((prev) => !prev);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            photo={photo}
            id={id}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <ButtonWrapper>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={onEdit}>
              {isEditing ? "Cancel" : "Edit"}
            </EditButton>
          </ButtonWrapper>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
