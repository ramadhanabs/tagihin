import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, Timestamp } from "firebase/firestore";

export interface CreditorDoc {
  id: string;
  name: string;
  email: string;
  phone: string;

  creditAttribute?: {
    paymentDeadline: Timestamp;
    amount: number;
  };
}

export const useCreditors = (userId: string) => {
  return useQuery({
    queryFn: () => getDocs(collection(db, "users", userId, "creditors")),
    queryKey: ["users", "creditors", userId],
    enabled: !!userId,
  });
};
