import { Library } from 'lucide-react';

interface Props {
  onReset?: () => void;
}

export function Header({ onReset }: Props) {
  const handleHomeClick = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="text-center mb-6 md:mb-8 max-w-3xl w-full flex flex-col items-center z-50">
      
      <button 
        onClick={handleHomeClick}
        aria-label="Return to home"
        className="group relative inline-block transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl px-4 py-2 mb-1 md:mb-2"
      >
        <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* UPGRADE: Integrated Icon & Wordmark Layout */}
        <div className="relative flex items-center justify-center gap-3">
          {/* The Logo Mark */}
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <Library className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </div>
          
          {/* The Wordmark */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            ERA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">BOOKS</span>
          </h1>
        </div>
      </button>
      
      <p className="text-gray-400 text-xs md:text-sm font-medium max-w-md mx-auto leading-relaxed px-4 tracking-wide mt-2">
        Intelligent curation for your personal library.
      </p>
      
    </header>
  );
}