export function Footer() {
  return (
    <footer className="relative z-20 flex-shrink-0 w-full text-center border-t border-white/5 bg-black/60 backdrop-blur-xl pt-3 pb-4 md:py-5 px-4">
      <p className="text-[8px] md:text-[9px] text-gray-500 mb-1.5 md:mb-2 max-w-xl mx-auto leading-tight font-medium tracking-wide">
        Disclaimer: Recommendations are algorithmically synthesized exclusively from our internal database. While engineered for high-fidelity matching, curation vectors are subjective and provided without absolute guarantee.
      </p>
      <p className="text-[9px] md:text-[10px] font-sans text-gray-400 tracking-[0.15em] md:tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-1 mt-2">
        Engineered & Developed by
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-80 transition-opacity ml-1"
        >
          OSMAN KHAN
        </a>
      </p>
    </footer>
  );
}