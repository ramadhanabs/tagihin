import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTopCreditors } from "@/queries/useTopCreditors";
import { CreditorDoc } from "@/queries/useCreditors";
import { formatRupiah } from "@/utils/numberUtils";
import { Context } from "../_app";
import { Skeleton } from "@mantine/core";

const DashboardPage = () => {
  const router = useRouter();
  const [isShowNominal, setIsShowNominal] = useState(false);
  const { userData } = useContext(Context);

  const topCreditorsQuery = useTopCreditors(userData?.uid ?? "");
  const topCreditorData = useMemo(() => {
    const extractedData: CreditorDoc[] = [];

    if (!topCreditorsQuery.data?.empty) {
      topCreditorsQuery.data?.forEach(doc => {
        const data = doc.data() as CreditorDoc;
        extractedData.push(data);
      });
    }

    return extractedData;
  }, [topCreditorsQuery.data?.docs]);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        router.push("/login");
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Tagihin App</title>
      </Head>
      <DashboardLayout>
        {/* Total Piutang */}
        <div className="px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-lg">Total Piutang</p>
            <Link href="/dashboard/credit-list" className="text-xs">
              Lihat Semua
            </Link>
          </div>
          <div className="flex items-center justify-between">
            {isShowNominal ? (
              <div className="h-[50px]">
                <p className="font-bold text-[32px]">Rp. 300.000</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 h-[50px]">
                {}
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            <button onClick={() => setIsShowNominal(!isShowNominal)}>
              {isShowNominal ? (
                <FaEye className="text-gray-700 w-6 h-6 hover:text-white transition-all" />
              ) : (
                <FaEyeSlash className="text-gray-700 w-6 h-6 hover:text-white transition-all" />
              )}
            </button>
          </div>
        </div>

        {/* Piutang Jatuh Tempo with 7 days */}
        <div className="px-4 pb-8">
          <div className="rounded-[24px] w-full p-4 flex flex-col gap-[24px] border border-gray-700 bg-gray-900 hover:border-cyan-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">John Doe</p>
                <p className="text-xs opacity-50">johndoe@gmail.com</p>
              </div>

              <div>
                <p className="text-xs opacity-50 text-right">Jatuh Tempo</p>
                <p className="text-lg font-bold">1 Maret 2024</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-50">Total Piutang</p>
                <p className="text-[32px] font-bold">Rp. 500.000</p>
              </div>

              <button className="w-[120px] bg-cyan-800/50 text-xs font-bold py-2 border border-cyan-500/20 hover:border-cyan-500 text-white rounded-lg transition-all">
                Tagih Now!
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Peminjam Terbanyak */}
        {!topCreditorsQuery.data?.empty && (
          <div className="px-4 pb-8">
            <div className="flex flex-col gap-4">
              <p className="text-lg">Top 3 Peminjam Terbanyak</p>

              {!userData || topCreditorsQuery.isLoading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </div>
              ) : (
                <>
                  {topCreditorData.map(creditor => (
                    <div className="pb-3 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white overflow-hidden">
                          <img
                            src="https://api.dicebear.com/7.x/notionists/svg"
                            alt="avatar"
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-bold">{creditor.name}</p>
                          <p className="text-xs opacity-50">{creditor.email}</p>
                        </div>
                      </div>

                      <p className="font-bold text-lg">
                        {formatRupiah(creditor.creditAttribute?.amount)}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
