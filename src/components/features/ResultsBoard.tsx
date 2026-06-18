import { Library, ArrowLeft } from 'lucide-react';
import { BookNode } from './BookNode';

interface Props {
  recommendations: string[][];
  searchedBook: string;
  onReset: () => void;
}

export function ResultsBoard({ recommendations, searchedBook, onReset }: Props) {
  if (recommendations.length === 0) return null;

  return (
    <div className="w-full animate-fade-in h-full">
      
      {/* Sticky Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-3 mb-6 sticky top-0 bg-[#050505]/95 backdrop-blur-xl z-30 pt-4 gap-4 sm:gap-0 transition-all">
        <div>
          <h2 className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-0.5 md:mb-1">
            Your Curated Library
          </h2>
          <div className="text-base md:text-lg text-white font-semibold flex items-center gap-2 break-all leading-tight">
            <Library className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
            {searchedBook === "Custom Blended Matrix" ? "Engineered from your benchmark selections" : `Inspired by ${searchedBook}`}
          </div>
        </div>
        
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <button 
            onClick={onReset}
            className="group flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            New Matrix
          </button>
          <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
            {recommendations.length} MATCHES
          </span>
        </div>
      </div>
      
      {/* UPGRADE: Forced 2-column mobile grid, expanding to 3 and 4 columns on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 relative z-10">
        {recommendations.map((rec, index) => (
          <BookNode 
            key={index} 
            title={rec[0]} 
            author={rec[1]} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}