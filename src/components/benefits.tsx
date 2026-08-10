import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

export interface Benefit {
  id: number;
  translation: string;
  narrator: string;
}

interface BenefitsProps {
  benefits: Benefit[] | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Benefits = ({ benefits, title, isOpen, onClose }: BenefitsProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="rounded-t-[35px] py-2 max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-base font-bold text-center">
            Keutamaan {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-[15px] px-6 pb-6 overflow-y-auto">
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
};

export { Benefits };
