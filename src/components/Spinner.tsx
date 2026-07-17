import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('grid place-items-center', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-brand" />
    </div>
  );
}

export default Spinner;
