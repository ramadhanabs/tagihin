import { CreditorDoc } from "@/queries/useCreditors";
import { formatRupiah } from "@/utils/numberUtils";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ListCreditorPanelProps {
  onSelect: (selected: CreditorDoc) => void;
  onSave: () => void;
  data: CreditorDoc[];
  selectedId: string;
}

const ListCreditorPanel = ({ onSelect, onSave, data, selectedId }: ListCreditorPanelProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {data.map(creditor => (
        <button
          className={twMerge(
            "border border-cyan-600/50 p-2 rounded-2xl text-left",
            selectedId === creditor.id ? "border-cyan-600/80" : "border-gray-700"
          )}
          key={creditor.id}
          onClick={() => onSelect(creditor)}
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

              <p className="text-xs opacity-50">
                {creditor.email} - {creditor.phone}
              </p>

              {creditor.creditAttribute?.amount && (
                <p className="text-xs opacity-50">
                  Total Pinjaman {formatRupiah(creditor.creditAttribute?.amount)}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}

      <Button
        onClick={onSave}
        variant="gradient"
        className="mt-6"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
      >
        <div className="flex items-center gap-2">Pilih Peminjam</div>
      </Button>
    </div>
  );
};

export default ListCreditorPanel;
