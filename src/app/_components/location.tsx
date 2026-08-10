import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/providers/settings-store-provider';

interface LocationProps {
  isOpen: boolean;
  onClose: () => void;
}

type HandleChangeLocation = React.ChangeEvent<HTMLInputElement>;

const Location = ({ isOpen, onClose }: LocationProps) => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Lokasi</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Contoh: Bogor"
          value={tempLocation}
          onChange={handleChangeLocation}
        />
        <DialogFooter>
          <Button onClick={handleClickLocation} className="hover:opacity-90">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { Location };
