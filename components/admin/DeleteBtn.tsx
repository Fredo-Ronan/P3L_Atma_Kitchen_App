"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef } from "react";
import { Button } from "../ui/button";

interface Props {
  hapusData: (id: number) => void;
  id: number;
}

const DeleteBtn = ({ hapusData, id }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    hapusData(id);
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-red-500 text-white hover:bg-red-500/50 py-1 px-3 rounded">
        Hapus
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah kamu yakin ingin menghapus data ini?</DialogTitle>
          <DialogDescription>
            Data yang sudah dihapus tidak bisa dikembalikan
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            onClick={handleSubmit}
           
          >
            Hapus
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
          </DialogClose>
          <DialogClose ref={buttonRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBtn;
