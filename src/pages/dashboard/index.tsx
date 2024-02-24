import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        router.push("/login");
      }
    });
  }, []);

  return <div>
    <p>test</p>
  </div>;
};

export default DashboardPage;
