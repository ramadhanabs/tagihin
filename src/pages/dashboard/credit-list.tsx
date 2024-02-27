import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CreditorDoc, useCreditors } from "@/queries/useCreditors";
import { formatRupiah } from "@/utils/numberUtils";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Context } from "../_app";

const CreditListPage = () => {
  const { setSelectedId, setIsShowDetailDrawer, userData } = useContext(Context);
  const creditorsQuery = useCreditors(userData?.uid ?? "");
  const creditorsData = useMemo(() => {
    const extractedData: CreditorDoc[] = [];

    if (!creditorsQuery.data?.empty) {
      creditorsQuery.data?.forEach(doc => {
        const data = doc.data() as CreditorDoc;
        extractedData.push(data);
      });
    }

    return extractedData;
  }, [creditorsQuery.data]);

  const onOpenDrawer = (id: string) => {
    setIsShowDetailDrawer(true);
    setSelectedId(id);
  };

  return (
    <>
      <Head>
        <title>Credit List | Tagihin App</title>
      </Head>

      <DashboardLayout>
        <div className="px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard">
              <FaArrowCircleLeft className="w-6 h-6" />
            </Link>
            <p className="text-2xl font-semibold">Daftar Pinjaman</p>
          </div>

          <div className="flex flex-col gap-4">
            {creditorsData.map(creditor => (
              <button
                className="pb-3 border-b border-gray-800 flex items-center justify-between text-left"
                onClick={() => onOpenDrawer(creditor.id)}
                key={creditor.id}
              >
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

                <div>
                  <p className="font-bold text-lg">
                    {formatRupiah(creditor.creditAttribute?.amount)}
                  </p>
                  <p className="opacity-50 text-xs text-right">Lihat Detail</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CreditListPage;
