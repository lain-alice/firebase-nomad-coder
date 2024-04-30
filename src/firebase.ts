import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAxPj7PB1aTa3R8-YHcpnA8bR-su9x3M0",
  authDomain: "nwitter-reloaded-7fc1e.firebaseapp.com",
  projectId: "nwitter-reloaded-7fc1e",
  storageBucket: "nwitter-reloaded-7fc1e.appspot.com",
  messagingSenderId: "835599846646",
  appId: "1:835599846646:web:92becb3eab6174fd5070d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// apiKey 등 포함된 config 개체로 app을 생성
export const auth = getAuth(app);
// app에 대한 인증을 사용하고 싶다
