import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/providers/settings-store-provider';

type HandleChangeLocation = React.ChangeEvent<HTMLInputElement>;

type LocationProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

export function Location({ isOpen, onClose }: LocationProps) {
  const { location: savedLocation, setLocation: setSavedLocation } =
    useSettingsStore(state => state);
  const [tempLocation, setTempLocation] = useState(savedLocation);

  const handleChangeLocation = (event: HandleChangeLocation) =>
    setTempLocation(event.target.value);

  const handleClickLocation = () => {
    setSavedLocation(tempLocation);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setTempLocation(savedLocation);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, savedLocation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="bg-app-1 p-4">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-app-1-1">Ubah Lokasi</DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon"
              aria-label="Tutup dialog lokasi"
              onClick={onClose}
              className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
            >
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Input
          placeholder="Contoh: Bogor"
          value={tempLocation}
          onChange={handleChangeLocation}
          className="bg-app-2 text-app-2-2 capitalize"
        />
        <DialogFooter>
          <Button
            onClick={handleClickLocation}
            className="bg-app-6 text-app-6-6 hover:bg-app-6/80"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
