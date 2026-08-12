import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

export type Benefit = {
  id: number;
  translation: string;
  narrator: string;
};

type BenefitsProps = Readonly<{
  benefits: Benefit[] | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}>;

export function Benefits({ benefits, title, isOpen, onClose }: BenefitsProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] rounded-t-[35px] py-2">
        <DrawerHeader>
          <DrawerTitle className="text-center text-base font-bold">
            Keutamaan {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-[15px] overflow-y-auto px-6 pb-6">
          {benefits?.map(benefit => (
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
