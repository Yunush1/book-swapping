// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhgdItNUld2oztdaaEfgU0uM7f8thDDOc",
  authDomain: "bookswap-12625.firebaseapp.com",
  projectId: "bookswap-12625",
  storageBucket: "bookswap-12625.firebasestorage.app",
  messagingSenderId: "892827541623",
  appId: "1:892827541623:web:11b27e820a549b92216672",
  measurementId: "G-KDL56290WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);