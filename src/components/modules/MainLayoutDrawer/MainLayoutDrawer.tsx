import { auth } from "@/firebase";
import { CreditorDoc, useCreditors } from "@/queries/useCreditors";
import { Drawer } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import AddCreditorPanel from "./AddCreditorPanel";
import CreditPanel from "./CreditPanel";
import ListCreditorPanel from "./ListCreditorPanel";

interface MainLayoutDrawerProps {
  opened: boolean;
  close: () => void;
}

const MainLayoutDrawer = ({ opened, close }: MainLayoutDrawerProps) => {
  const [step, setStep] = useState(1);
  const [selectedCreditor, setSelectedCreditor] = useState<CreditorDoc | null>(null);
  const creditorsQuery = useCreditors(auth.currentUser?.uid ?? "");
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

  const onClose = () => {
    close();
  };

  const titleRenderer = () => {
    if (step === 1)
      return (
        <Drawer.Header>
          <Drawer.Title>Data Pinjaman</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
      );

    if (step === 2)
      return (
        <Drawer.Header>
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(1)}>
              <FaArrowLeft />
            </button>
            <p>Pilih peminjam untuk melanjutkan</p>
          </div>
          <button onClick={() => setStep(3)}>
            <FaPlusCircle className="w-6 h-6" />
          </button>
        </Drawer.Header>
      );

    if (step === 3)
      return (
        <Drawer.Header>
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(2)}>
              <FaArrowLeft />
            </button>
            <p>Data Peminjam</p>
          </div>
        </Drawer.Header>
      );
  };

  return (
    <Drawer.Root position="bottom" opened={opened} onClose={onClose} radius="md">
      <Drawer.Overlay />
      <Drawer.Content className="[&>section]:h-max">
        {titleRenderer()}
        <Drawer.Body className="h-max">
          {step === 1 && (
            <CreditPanel
              handleClickFieldCreditor={() => setStep(2)}
              fieldCreditorValue={selectedCreditor}
              onClose={() => {
                setSelectedCreditor(null);
                onClose();
              }}
            />
          )}

          {step === 2 && (
            <ListCreditorPanel
              data={creditorsData}
              onSelect={setSelectedCreditor}
              onSave={() => setStep(1)}
              selectedId={selectedCreditor?.id ?? ""}
            />
          )}

          {step === 3 && (
            <AddCreditorPanel
              onBack={() => {
                creditorsQuery.refetch();
                setStep(2);
              }}
            />
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default MainLayoutDrawer;
