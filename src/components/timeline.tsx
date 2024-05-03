import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]); // 이건 트윗 배열이고 기본값은 빈 배열이다
  const fetchTweets = async () => {
    const tweetsQuery = query(
      // 데이터를 쿼리해서 받은 데이터마다 객체 만듦
      collection(db, "tweets"), // 매개변수로 Firestore 인스턴스를
      orderBy("createdAt", "desc") // createdAt 기준으로 내림차순 정렬
    );
    const snapshot = await getDocs(tweetsQuery); // 결과로 QuerySnapShot 받음
    const tweets = snapshot.docs.map((doc) => {
      // snapshot에서 ITweet을 만족하는 모든 데이터 추출
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
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
