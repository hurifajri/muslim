// Eksternal
import { Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const Counter = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="flex items-center">
      <Button
        aria-label="Reset"
        variant="ghost"
        size="icon"
        onClick={() => setValue(0)}
        className="rounded-r-none hover:opacity-90"
      >
        <RotateCcw className="pointer-events-none" />
      </Button>
      <div className="w-12 h-10 flex items-center justify-center text-base font-bold">
        {value}
      </div>
      <Button
        aria-label="Hitung"
        variant="ghost"
        size="icon"
        onClick={() => setValue(v => v + 1)}
        className="rounded-l-none hover:opacity-90"
      >
        <Plus className="pointer-events-none" />
      </Button>
    </div>
  );
};

export { Counter };
