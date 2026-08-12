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
        <DrawerContent className="max-h-[80vh] rounded-t-[35px] py-2">
          <DrawerHeader>
            <DrawerTitle className="text-center text-base font-bold">
              Keutamaan {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-[15px] overflow-y-auto px-6 pb-6">
            {benefits.map(benefit => (
              <p key={benefit.id} className="text-sm">
                {benefit.translation}
                <span className="text-xs opacity-80">{` [${benefit.narrator}]`}</span>
              </p>
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
