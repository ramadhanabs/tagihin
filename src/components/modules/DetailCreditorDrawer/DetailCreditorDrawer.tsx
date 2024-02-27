import { Context } from "@/pages/_app";
import { CreditorDoc, useCreditors } from "@/queries/useCreditors";
import {
  TransactionLogDoc,
  useCreditorTransactionLogs,
} from "@/queries/useCreditorTransactionLogs";
import { formatRupiah } from "@/utils/numberUtils";
import { Button, Drawer } from "@mantine/core";
import React, { useContext, useMemo } from "react";
import { twMerge } from "tailwind-merge";

interface DetailCreditorDrawerProps {
  opened: boolean;
  close: () => void;
}

const DetailCreditorDrawer = ({ opened, close }: DetailCreditorDrawerProps) => {
  const { selectedId, setSelectedId, userData } = useContext(Context);

  const creditorsQuery = useCreditors(userData?.uid ?? "");
  const creditorsData = useMemo(() => {
    const extractedData: CreditorDoc[] = [];

    if (!creditorsQuery.data?.empty) {
      creditorsQuery.data?.forEach(doc => {
        const data = doc.data() as CreditorDoc;
        extractedData.push(data);
      });
    }

    return extractedData.find(item => item.id === selectedId);
  }, [creditorsQuery.data, selectedId]);
  console.log("🚀 ~ creditorsData ~ creditorsData:", creditorsData, selectedId);

  const creditorTransactionLogQuery = useCreditorTransactionLogs(userData?.uid ?? "", selectedId);
  const transactionLogData = useMemo(() => {
    const extractedData: TransactionLogDoc[] = [];

    if (!creditorTransactionLogQuery.data?.empty) {
      creditorTransactionLogQuery.data?.forEach(doc => {
        const data = doc.data() as TransactionLogDoc;
        extractedData.push(data);
      });
    }

    return extractedData;
  }, [creditorTransactionLogQuery.data]);

  const totalAmount = useMemo(() => {
    const totalAmountOut = transactionLogData
      .filter(item => item.type === "out")
      .map(item => item.amount)
      .reduce((a, b) => a + b, 0);

    const totalAmountIn = transactionLogData
      .filter(item => item.type === "in")
      .map(item => item.amount)
      .reduce((a, b) => a + b, 0);

    return { totalAmountIn, totalAmountOut };
  }, [transactionLogData]);

  const onClose = () => {
    setSelectedId("");
    close();
  };

  return (
    <Drawer.Root position="bottom" opened={opened} onClose={onClose} radius="md" size="90%">
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Detail Peminjam</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body className="h-[calc(100%-60px)]">
          <div className="flex flex-col gap-4 h-full">
            <div className="p-3 border border-gray-100/20 rounded-xl flex items-center justify-between text-left w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg"
                    alt="avatar"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-bold">{creditorsData?.name}</p>
                  <p className="text-xs opacity-50">{creditorsData?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-xs opacity-50 text-right">Total Pinjaman</p>
                <p className="font-bold text-lg">
                  {formatRupiah(creditorsData?.creditAttribute?.amount)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-red-600/60 bg-red-600/10 p-3 rounded-xl flex flex-col gap-1 justify-center">
                <p className="text-xs opacity-50">Sudah Meminjam</p>
                <p className="text-lg font-bold text-white">
                  {formatRupiah(totalAmount.totalAmountOut)}
                </p>
              </div>

              <div className="border border-green-600/60 bg-green-600/10 p-3 rounded-xl flex flex-col gap-1 justify-center">
                <p className="text-xs opacity-50">Sudah Membayar</p>
                <p className="text-lg font-bold text-white">
                  {formatRupiah(totalAmount.totalAmountIn)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-[70%] overflow-scroll pb-[60px]">
              {transactionLogData.map(log => (
                <div
                  key={log.id}
                  className="relative flex items-center justify-between pb-3 border-b border-white/10"
                >
                  <div
                    className={twMerge(
                      "absolute w-[6px] h-full rounded-r-lg top-0 left-0",
                      log.type === "in" ? "bg-green-600" : "bg-red-500"
                    )}
                  ></div>

                  <div className="pl-4">
                    <p className="text-lg">{log.type === "in" ? "Bayar" : "Pinjam"}</p>
                    <p className="text-xs opacity-50">
                      {log.createdAt.toDate().toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div>
                    <p
                      className={twMerge(
                        "text-right text-lg font-semibold",
                        log.type === "in" ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {formatRupiah(log.amount)}
                    </p>
                    {/* <p className="text-xs opacity-50 text-right">Lihat Bukti</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute left-0 bottom-0 p-3 w-full">
            <Button
              variant="gradient"
              className="w-full"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              Kirim Pengingat Bayar
            </Button>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default DetailCreditorDrawer;
