import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

export interface TransactionLogDoc {
  id: string;
  type: "in" | "out";
  amount: number;
  createdAt: Timestamp;
}

export const useCreditorTransactionLogs = (userId: string, creditorId: string) => {
  return useQuery({
    queryKey: ["users", "creditors", "transaction-log", creditorId],
    queryFn: () =>
      getDocs(
        query(
          collection(db, "users", userId, "creditors", creditorId, "transactionLogs"),
          orderBy("createdAt", "desc")
        )
      ),
    enabled: !!creditorId,
  });
};
