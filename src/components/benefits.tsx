import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Benefit } from '@/schemas/items';

type BenefitsProps = Readonly<{
  title: string;
  benefits: Benefit[];
  isOpen: boolean;
  onClose: () => void;
}>;

export function Benefits({ benefits, title, isOpen, onClose }: BenefitsProps) {
  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="before:bg-app-1">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-app-1-1 text-left">
              Keutamaan {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            {benefits.map(benefit => (
              <div key={benefit.id} className="flex flex-col gap-2">
                <p className="text-app-1-1 text-base">{benefit.translation}</p>
                <p className="text-app-1-1 text-sm">{` [${benefit.narrator}]`}</p>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="bg-app-1 gap-4 p-4">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-app-1-1">Keutamaan {title}</DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon"
              aria-label="Tutup dialog keutamaan"
              onClick={onClose}
              className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
            >
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {benefits.map(benefit => (
            <div key={benefit.id} className="flex flex-col gap-2">
              <p className="text-app-1-1 text-base">{benefit.translation}</p>
              <p className="text-app-1-1 text-sm">{` [${benefit.narrator}]`}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
