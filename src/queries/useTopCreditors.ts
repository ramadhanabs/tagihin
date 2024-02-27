import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

export const useTopCreditors = (userId: string) => {
  return useQuery({
    queryFn: () =>
      getDocs(
        query(
          collection(db, "users", userId, "creditors"),
          orderBy("creditAttribute.amount"),
          limit(3)
        )
      ),
    queryKey: ["users", "creditors", "top", userId],
    enabled: !!userId,
  });
};
