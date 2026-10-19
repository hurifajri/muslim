import {
  Dialog,
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

type BenefitsContentProps = Readonly<{ benefits: Benefit[] }>;

function BenefitsContent({ benefits }: BenefitsContentProps) {
  return benefits.map(benefit => (
    <div key={benefit.id} className="flex flex-col gap-2">
      <p className="text-base">{benefit.translation}</p>
      <p className="text-sm">{` [${benefit.narrator}]`}</p>
    </div>
  ));
}

export function Benefits({ benefits, title, isOpen, onClose }: BenefitsProps) {
  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-left">Keutamaan {title}</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <BenefitsContent benefits={benefits} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keutamaan {title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <BenefitsContent benefits={benefits} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
