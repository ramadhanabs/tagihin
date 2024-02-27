import { Button, Input } from "@mantine/core";
import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useForm } from "@mantine/form";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

interface AddCreditorPanelProps {
  onBack: () => void;
}

const AddCreditorPanel = ({ onBack }: AddCreditorPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const id = uuidv4();
    const userId = auth.currentUser?.uid ?? "";

    /* Create validation email has been added */
    const creditorsSnapshot = await getDocs(collection(db, "users", userId, "creditors"));
    creditorsSnapshot.forEach(doc => {
      console.log(doc.data());
    });

    await setDoc(doc(db, "users", userId, "creditors", id), {
      id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
      .then(() => {
        setIsSuccess(true);

        setTimeout(() => {
          onBack();
        }, 1000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={form.onSubmit(values => handleSubmit(values))} className="flex flex-col gap-4">
      <Input placeholder="Nama" {...form.getInputProps("name")} />
      <Input placeholder="Email" {...form.getInputProps("email")} />
      <Input type="number" placeholder="No Handphone" {...form.getInputProps("phone")} />
      {isSuccess && <p className="text-xs text-green-600">Sukses menambahkan data</p>}

      <Button
        type="submit"
        variant="gradient"
        className="mt-6"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
        loading={isLoading}
      >
        <div className="flex items-center gap-2">
          <FaPaperPlane />
          Simpan
        </div>
      </Button>
    </form>
  );
};

export default AddCreditorPanel;
