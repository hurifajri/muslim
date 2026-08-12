import { XIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
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
          <DrawerHeader className="flex-row items-center justify-between p-4">
            <DrawerTitle className="text-app-1-1 text-left">
              Keutamaan {title}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                size="icon"
                aria-label="Tutup drawer keutamaan"
                onClick={onClose}
                className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
              >
                <XIcon />
              </Button>
            </DrawerClose>
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
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
