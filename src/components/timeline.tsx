import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import {
  collection,
  query,
  limit,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]); // 이건 트윗 배열이고 기본값은 빈 배열이다

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null; // onSnapshot 함수가 Unsubscribe 함수를 반환

    const fetchTweets = async () => {
      const tweetsQuery = query(
        // 데이터를 쿼리해서 받은 데이터마다 객체 만듦
        collection(db, "tweets"), // 매개변수로 Firestore 인스턴스를
        orderBy("createdAt", "desc"), // createdAt 기준으로 내림차순 정렬
        // 이대로면 트윗이 300만개여도 다 불러오게 됨
        // 페이지네이션 필요
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery); // 결과로 QuerySnapShot 받음
      // getDocs 대신 onSnapshot 사용
      // 문서 한 번만 가져오는 대신 쿼리에 이벤트 리스너 연결
      // 무언가 삭제, 편집, 생성되었다는 알림 받으면
      // 해당 쿼리 문서 보면서 데이터 추출
      // 트윗 누르면 실시간 반영! db에서 고쳐도 바로 반영됨
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        // 이벤트 리스너 항상 켜놓을 수 없다
        // 유저가 페이지 떠나도 켜져있으면 그만큼 돈을 더 내야 함
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id, // db에서 id는 tweet, username 등보다 상위에 있음
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); // unsubscribe가 true 되면 unsubscribe 함수 호출
    };
    // useEffect의 tear down(cleanup) 사용
    // useEffect는 유저가 화면을 보지 않을 때 값을 반환하며 cleanup 실시
    // 유저가 로그아웃하거나 다른 페이지 가면 타임라인 이벤트리스너 필요없음
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
