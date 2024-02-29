import { auth, db } from "@/firebase";
import { CreditorDoc } from "@/queries/useCreditors";
import { formatRupiah } from "@/utils/numberUtils";
import { uuidv4 } from "@firebase/util";
import { Button, FileInput, Input, NumberInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { doc, DocumentReference, getDoc, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPaperPlane } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface CreditPanelProps {
  handleClickFieldCreditor: () => void;
  fieldCreditorValue: CreditorDoc | null;
  onClose: () => void;
}

interface FormValues {
  amount: number;
  paymentDeadline: Date;
}

const CreditPanel = ({
  handleClickFieldCreditor,
  fieldCreditorValue,
  onClose,
}: CreditPanelProps) => {
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState<"pinjam" | "bayar">("pinjam");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<FormValues>({
    initialValues: {
      amount: 0,
      paymentDeadline: new Date(),
    },
  });

  const refetchCreditor = () => {
    queryClient.invalidateQueries({ queryKey: ["users", "creditors"] });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid ?? "";
      const creditorId = fieldCreditorValue?.id ?? "";
      const transactionLogId = uuidv4();

      const currentCreditAmount = fieldCreditorValue?.creditAttribute?.amount ?? 0;

      if (selectedTab === "pinjam") {
        if (fieldCreditorValue) {
          /* Handle begin batched writes */
          const batch = writeBatch(db);

          batch.update(doc(db, "users", userId, "creditors", creditorId), {
            creditAttribute: {
              paymentDeadline: Timestamp.fromDate(values.paymentDeadline),
              amount: currentCreditAmount + values.amount, // incremented current credit amount with form's amount
              updatedAt: Timestamp.now(),
            },
          });

          batch.set(
            doc(db, "users", userId, "creditors", creditorId, "transactionLogs", transactionLogId),
            {
              id: transactionLogId,
              type: "out",
              amount: values.amount,
              createdAt: Timestamp.now(),
            }
          );

          await batch.commit().then(() => {
            refetchCreditor();
            onClose();
            notifications.show({
              title: "Successfully submitting data",
              message: "",
              color: "green",
            });
          });
        }
      }

      if (selectedTab === "bayar") {
        if (fieldCreditorValue) {
          /* Pengecekan apakah jumlah pembayaran > jumlah yang dipinjam */
          if (values.amount < currentCreditAmount) {
            const batch = writeBatch(db);

            batch.update(doc(db, "users", userId, "creditors", creditorId), {
              creditAttribute: {
                paymentDeadline: Timestamp.fromDate(values.paymentDeadline),
                amount: currentCreditAmount - values.amount, // incremented current credit amount with form's amount
                updatedAt: Timestamp.now(),
              },
            });

            batch.set(
              doc(
                db,
                "users",
                userId,
                "creditors",
                creditorId,
                "transactionLogs",
                transactionLogId
              ),
              {
                id: transactionLogId,
                type: "in",
                amount: values.amount,
                createdAt: Timestamp.now(),
              }
            );

            await batch.commit().then(() => {
              refetchCreditor();
              onClose();
              notifications.show({
                title: "Successfully submitting data",
                message: "",
                color: "green",
              });
            });
          } else {
            setErrorMessage(`Tidak bisa membayar melebihi ${formatRupiah(currentCreditAmount)}`);
          }
        }
      }
    } catch (error: any) {
      notifications.show({
        title: "Failed to submit data",
        message: "Oops, something happened",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(values => handleSubmit(values))}
      className="flex flex-col justify-between h-full"
    >
      <div className="h-full flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={twMerge(
              "border  bg-red-600/10 p-2 rounded-xl flex items-center justify-center gap-3",
              selectedTab === "pinjam" ? "border-red-600/80" : "border-transparent"
            )}
            onClick={() => setSelectedTab("pinjam")}
          >
            <FaArrowUp />
            <p className="text-lg font-bold">Pinjam</p>
          </div>

          <div
            className={twMerge(
              "border border-green-600/60 bg-green-600/10 p-2 rounded-xl flex items-center justify-center gap-3",
              selectedTab === "bayar" ? "border-green-600/80" : "border-transparent"
            )}
            onClick={() => setSelectedTab("bayar")}
          >
            <FaArrowDown />
            <p className="text-lg font-bold">Bayar</p>
          </div>
        </div>
        <Input
          placeholder="Peminjam"
          value={fieldCreditorValue?.name}
          onClick={handleClickFieldCreditor}
          readOnly
        />
        {selectedTab === "bayar" && (
          <p className="text-xs">
            Total pinjaman sekarang: {formatRupiah(fieldCreditorValue?.creditAttribute?.amount)}
          </p>
        )}
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <NumberInput
          placeholder="Nominal Pinjaman"
          thousandSeparator=","
          prefix="Rp."
          {...form.getInputProps("amount")}
        />
        {selectedTab === "pinjam" && (
          <DatePickerInput
            placeholder="Jatuh Tempo"
            popoverProps={{ withinPortal: true }}
            minDate={new Date()}
            {...form.getInputProps("paymentDeadline")}
          />
        )}
      </div>
      <Button
        type="submit"
        variant="gradient"
        className="mt-6"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
        loading={isLoading}
        disabled={selectedTab === "bayar" && !fieldCreditorValue?.creditAttribute?.amount}
      >
        <div className="flex items-center gap-2">
          <FaPaperPlane />
          Simpan
        </div>
      </Button>
    </form>
  );
};

export default CreditPanel;
