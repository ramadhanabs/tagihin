import { Button } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tagihin App</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-4 items-center">
          <img
            className="w-[120px] h-[120px] rounded-full"
            src="https://images.unsplash.com/photo-1593672715438-d88a70629abe?q=70&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <h1 className="text-[32px] text-center text-white font-bold leading-[36px] capitalize">
            Hutang Tembilang Belum Langsai <br></br>
            Hutang Tajak Bila Pula
          </h1>
          <p className="text-white text-center opacity-80 mb-8">
            Catat dan Tagih Hutangmu dengan Tagihin
          </p>
          <Link href="/dashboard">
            <Button variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }}>
              <div className="flex items-center gap-3">
                Mulai Sekarang
                <FaArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
