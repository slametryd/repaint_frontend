import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD8VbE4TegYT3Iv1QiXzpzeKRzU0ywiHQ",
  authDomain: "repaint-body-92807.firebaseapp.com",
  projectId: "repaint-body-92807",
  storageBucket: "repaint-body-92807.firebasestorage.app",
  messagingSenderId: "764388709469",
  appId: "1:764388709469:web:ab3018240494ebbe8429b4",
  measurementId: "G-DBJQ3RS89Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
export { auth, provider, signInWithPopup };

// const firebaseConfig = {
//   apiKey: "AIzaSyDD8VbE4TegYT3Iv1QiXzpzeKRzU0ywiHQ",
//   authDomain: "repaint-body-92807.firebaseapp.com",
//   projectId: "repaint-body-92807",
//   storageBucket: "repaint-body-92807.firebasestorage.app",
//   messagingSenderId: "764388709469",
//   appId: "1:764388709469:web:ab3018240494ebbe8429b4",
//   measurementId: "G-DBJQ3RS89Y",
// };
