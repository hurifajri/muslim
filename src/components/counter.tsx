import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export function Counter() {
  const [value, setValue] = useState(0);

  return (
    <ButtonGroup aria-label="Tombol hitung" className="items-center">
      <Button size="icon-lg" onClick={() => setValue(0)}>
        <RotateCcwIcon />
      </Button>
      <div className="bg-primary/90 dark:bg-primary text-primary-foreground -ml-1 flex h-9.5 w-12 items-center justify-center font-bold">
        {value}
      </div>
      <Button size="icon-lg" onClick={() => setValue(v => v + 1)}>
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
