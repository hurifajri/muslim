import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export function Counter() {
  const [value, setValue] = useState(0);

  return (
    <ButtonGroup aria-label="Tombol hitung" className="items-center">
      <Button
        size="icon-lg"
        onClick={() => setValue(0)}
        className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
      >
        <RotateCcwIcon />
      </Button>
      <div className="border-app-6 -ml-1 flex h-9.5 w-12 items-center justify-center border-y font-bold">
        {value}
      </div>
      <Button
        size="icon-lg"
        onClick={() => setValue(v => v + 1)}
        className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
