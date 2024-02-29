import { Button } from "@mantine/core";
import { FaGoogle } from "react-icons/fa";
import { auth, db } from "@/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
  UserCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { notifications } from "@mantine/notifications";

const provider = new GoogleAuthProvider();

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, provider)
      .then(async result => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        if (user) {
          await postUser(user);
        }
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /* Register userData to firestore */
  const postUser = async (userData: User) => {
    const userDocSnapshot = await getDoc(doc(db, "users", userData.uid));

    if (userDocSnapshot.exists()) {
      notifications.show({
        title: "Login success",
        message: "Redirecting to dashboard page",
        color: "green",
      });
      return;
    }

    await setDoc(doc(db, "users", userData.uid), {
      id: userData.uid,
      email: userData.email,
    }).then(() => {
      notifications.show({
        title: "Success registering user",
        message: "Redirecting to dashboard page",
        color: "green",
      });
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        router.push("/dashboard");
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Login | Tagihin App</title>
      </Head>
      <div className="flex items-center justify-center h-screen p-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] text-white text-center font-bold leading-[32px]">
            Login untuk lanjut
          </h1>
          <p className="text-xl text-white text-center opacity-80 mb-8">
            Nampaknya kamu belum terdaftar dalam Tagihin, silahkan klik button di bawah untuk
            registrasi dan login.
          </p>

          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            onClick={handleLogin}
            loading={isLoading}
          >
            <div className="flex items-center gap-2">
              <FaGoogle />
              Login with Google
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
