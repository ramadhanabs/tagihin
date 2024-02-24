import { Button } from "@mantine/core";
import { FaGoogle } from "react-icons/fa";
import { auth } from "@/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const provider = new GoogleAuthProvider();

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, provider)
      .then(result => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("🚀 ~ awaitsignInWithPopup ~ user:", token, user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("🚀 ~s handleLogin ~ errorCode:", errorCode, errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
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
    <div className="flex items-center justify-center h-screen">
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
  );
};

export default LoginPage;
