import { useState, useEffect } from 'react';
import { BookOpen, Star, Sparkles, ShoppingCart, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface Props {
  title: string;
  author: string;
  index: number;
}

export function BookNode({ title, author, index }: Props) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCover = async () => {
      try {
        // Query Open Library API for the book
        const query = encodeURIComponent(`${title} ${author}`);
        const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`);
        const data = await res.json();

        if (isMounted && data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
          setCoverUrl(`https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`);
        } else {
          if (isMounted) setIsLoading(false);
        }
      } catch {
        // FIXED: Removed the unused 'error' variable to clear the ESLint warning.
        // We fail silently and trigger the CSS fallback cover.
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCover();

    return () => {
      isMounted = false;
    };
  }, [title, author]);

  // Procedural gradient fallback for books without covers
  const gradientSeed = title.length % 3;
  const gradientClass = 
    gradientSeed === 0 ? "from-cyan-950/40 via-neutral-950 to-neutral-950" :
    gradientSeed === 1 ? "from-blue-950/40 via-neutral-950 to-neutral-950" :
    "from-indigo-950/40 via-neutral-950 to-neutral-950";

  // Medal Logic for Top 3 Picks
  const isFirst = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;

  let medalColor = "text-accent/60";
  let glowClass = "";
  let badgeText = "RECOMMENDED";

  if (isFirst) {
    medalColor = "text-yellow-400";
    glowClass = "drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]";
    badgeText = "MASTER MATCH";
  } else if (isSecond) {
    medalColor = "text-slate-300";
    glowClass = "drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]";
    badgeText = "EXCELLENT MATCH";
  } else if (isThird) {
    medalColor = "text-amber-600";
    glowClass = "drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]";
    badgeText = "STRONG MATCH";
  }

  // --- UPGRADE: Intelligent Search Query Sanitization ---
  // Removes text inside parentheses (e.g., "Game of Thrones (Book 1)" -> "Game of Thrones")
  const cleanTitle = title.replace(/ *\([^)]*\) */g, '').trim();
  const safeSearchQuery = encodeURIComponent(`${cleanTitle} ${author}`);

  // '&i=stripbooks' forces Amazon to exclusively search the Book department
  const amazonLink = `https://www.amazon.com/s?k=${safeSearchQuery}&i=stripbooks`;
  
  // 'search_type=books' forces Goodreads to bypass generic results
  const goodreadsLink = `https://www.goodreads.com/search?q=${safeSearchQuery}&search_type=books`;

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-3 md:p-5 hover:bg-white/[0.03] hover:border-accent/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-all duration-500 group flex flex-col justify-between relative h-full">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex flex-col flex-1">
        
        {/* Cover Container */}
        <div className={`w-full aspect-[3/4] bg-neutral-900 border border-white/5 rounded-xl mb-3 md:mb-4 relative overflow-hidden shadow-2xl group-hover:border-accent/30 transition-all duration-500`}>
          
          {/* Skeleton Loader */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-6 h-6 text-white/10" />
            </div>
          )}

          {/* Real Book Cover Image */}
          {coverUrl && (
            <img 
              src={coverUrl} 
              alt={`Cover of ${title}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)} 
            />
          )}

          {/* Fallback CSS Cover */}
          {!isLoading && !coverUrl && (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} p-3 flex flex-col justify-center items-center text-center`}>
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
              <div className="absolute top-0 left-2 w-[2px] h-full bg-gradient-to-b from-cyan-500/40 to-blue-600/10 opacity-60"></div>
              <BookOpen className="w-6 h-6 text-white/10 mb-2" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Cover Unavailable</span>
            </div>
          )}

          {/* Persistent Rank Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
            <span className={`bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[8px] md:text-[9px] font-bold tracking-[0.1em] flex items-center gap-1 ${medalColor} ${glowClass}`}>
              <Star className="w-2.5 h-2.5" fill={isFirst || isSecond || isThird ? "currentColor" : "none"} /> 
              {isFirst ? "RANK 01" : isSecond ? "RANK 02" : isThird ? "RANK 03" : `VOL 0${index + 1}`}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
             <span className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[7px] md:text-[8px] font-bold tracking-widest text-gray-300 uppercase flex items-center gap-1 shadow-xl">
               <Sparkles className="w-2 h-2 text-accent" /> {badgeText}
            </span>
          </div>

          {/* ACTIONABLE EXITS: Hover Overlay Menu */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 z-20">
            <a 
              href={amazonLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#ff9900]/10 hover:bg-[#ff9900] text-[#ff9900] hover:text-black border border-[#ff9900]/30 hover:border-[#ff9900] transition-colors py-2.5 rounded-lg text-xs font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 duration-300"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Amazon
            </a>
            
            <a 
              href={goodreadsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/10 hover:border-white transition-colors py-2.5 rounded-lg text-xs font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Goodreads
            </a>
          </div>

        </div>

        {/* Text Details below cover */}
        <div className="px-1 flex-1 flex flex-col">
          <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug group-hover:text-accent transition-colors duration-300 mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">
            <span className="truncate">By {author}</span>
          </div>
        </div>

      </div>
    </div>
  );
}