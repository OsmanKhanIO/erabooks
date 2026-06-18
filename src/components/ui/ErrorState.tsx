import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  message: string;
  onReset?: () => void;
}

export function ErrorState({ message, onReset }: Props) {
  if (!message) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-red-950/40 border border-red-900/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md animate-fade-in shadow-2xl">
      <div className="flex items-start sm:items-center gap-3 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="font-medium tracking-wide text-left">{message}</span>
      </div>
      
      {/* Actionable Recovery Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Reset
        </button>
      )}
    </div>
  );
}