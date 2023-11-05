import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { message, notification } from 'antd';

const errorMap = {
  "auth/invalid-email": "Địa chỉ email không hợp lệ.",
  "auth/wrong-password": "Mật khẩu không chính xác.",
  "auth/user-not-found": "Người dùng không tồn tại.",
  "auth/user-disabled": "Tài khoản người dùng đã bị vô hiệu hóa.",
  "auth/email-already-in-use": "Địa chỉ email đã được sử dụng bởi một người dùng khác.",
  "auth/weak-password": "Mật khẩu không đủ mạnh.",
  "auth/operation-not-allowed": "Phương thức xác thực không được phép.",
  "auth/popup-closed-by-user": "Cửa sổ đăng nhập đã được đóng bởi người dùng.",
  "auth/account-exists-with-different-credential": "Tài khoản đã tồn tại với một phương thức đăng nhập khác.",
  "auth/invalid-credential": "Chứng chỉ xác thực không hợp lệ.",
  "auth/invalid-verification-code": "Mã xác minh không hợp lệ.",
  "auth/invalid-verification-id": "ID xác minh không hợp lệ.",
  "auth/captcha-check-failed": "Xác minh CAPTCHA không thành công."
};

// Sử dụng mã lỗi để truy cập thông báo tương ứng


export type User = {
  displayName?: string,
  email: string,
  password?: string,
  access?: number,
  phoneNumber?: string,
  photoURL?: string,
};

const register = async (payload: User) => {
  const {
    displayName,
    email,
    password,
  } = payload;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password as string);
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      displayName:displayName,
      email,
    })
    console.log("result",res)
    return res;
  } catch (error) {
    message.error(errorMap[error.code])
    console.log(error);
    return null;
  }
}

const login = async (payload: User) => {
  const {
    email,
    password,
  } = payload;
  try {
    await signInWithEmailAndPassword(auth, email, password as string)
    return true;
  } catch (error) {
    message.error(errorMap[error.code])
    console.log("login",{error});

    return null;
  }
}

const logout = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
  } catch (error) {
    message.error(errorMap[error.code])
    console.log(error);
    return null;
  }
}

const getUsersByEmail = async (email: string[]) => {
  try {
    if(email.length === 0) return null;
    const q = query(collection(db, "users"), where("email", "in", email));
    const docs = await getDocs(q);
    if(!docs.empty){
      return docs.docs.map((doc) => doc.data() as User);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const findByEmail = async (email: string) => {
  try {
    if(email.length === 0) return null;
    const q = query(collection(db, "users"), where("email", "==", email));
    const docs = await getDocs(q);
    if(!docs.empty){
      return docs.docs.map((doc) => doc.data() as User)[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}


const authApi = {
  register,
  login,
  logout,
  getUsersByEmail,
  findByEmail,

}

export default authApi;