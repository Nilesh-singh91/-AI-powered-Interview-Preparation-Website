import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../config/firebase";

const googleLogin = async () => {

  const result = await signInWithPopup(

    auth,

    googleProvider

  );

  return result.user;

};

export default googleLogin;