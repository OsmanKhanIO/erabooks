import { useState, useEffect } from 'react';
import { Library, BookOpen, ChevronRight, CheckCircle2, ArrowLeft, Search, Plus, X, Sparkles, BookMarked } from 'lucide-react';

interface Props {
  onMatrixCalibrated: (anchors: string[]) => void;
  onReset: () => void;
}

const MASTER_GENRES = [
  'Romance', 'Fantasy', 'Historical Fiction', 'Thriller', 'Business', 'Science Fiction', 
  'Philosophy', 'Mystery', 'Cyberpunk', 'Psychology', 'Economics', 'Memoir', 
  'True Crime', 'Classic Literature', 'Space Opera', 'Poetry', 'Horror', 'Self-Help'
];

const ALL_KNOWN_BOOKS = [
  "1984", "A Walk to Remember", "Animal Farm", "2001: A Space Odyssey", 
  "A Tale of Two Cities", "American Gods", "A Confederacy of Dunces", "A Time to Kill",
  "The Notebook", "Dune", "The Hobbit", "Pride and Prejudice", "The Martian", 
  "White Teeth", "Catch-22", "The Da Vinci Code", "White Oleander",
  "Harry Potter and the Sorcerer's Stone (Book 1)",
  "Harry Potter and the Chamber of Secrets (Book 2)",
  "Harry Potter and the Prisoner of Azkaban (Book 3)",
  "Harry Potter and the Goblet of Fire (Book 4)",
  "A Game of Thrones (A Song of Ice and Fire, Book 1)",
  "A Clash of Kings (A Song of Fire and Ice, Book 2)",
  "The Lord of the Rings", "Angels & Demons"
];

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function OnboardingMatrix({ onMatrixCalibrated, onReset }: Props) {
  const [step, setStep] = useState(0);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAnchors, setSelectedAnchors] = useState<string[]>([]);
  
  const [loadingPhrase, setLoadingPhrase] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [availableGenres] = useState<string[]>(() => shuffleArray(MASTER_GENRES).slice(0, 10));
  const [availableBooks] = useState<string[]>(() => shuffleArray(ALL_KNOWN_BOOKS).slice(0, 6));
  
  const [customBookInput, setCustomBookInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // UPGRADE: Derived state. No useEffect or useState needed for suggestions!
  const suggestions = debouncedSearchTerm.length > 1
    ? ALL_KNOWN_BOOKS.filter(book => 
        book.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && !selectedAnchors.includes(book)
      ).slice(0, 5)
    : [];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : 
      prev.length < 3 ? [...prev, genre] : prev
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBookInput(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(customBookInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [customBookInput]);

  const addAnchor = (book: string) => {
    if (selectedAnchors.length >= 2 || !book.trim() || selectedAnchors.includes(book)) return;
    if (!ALL_KNOWN_BOOKS.includes(book)) return; 

    setSelectedAnchors(prev => [...prev, book.trim()]);
    setCustomBookInput(''); 
    setDebouncedSearchTerm('');
  };

  const removeAnchor = (bookToRemove: string) => {
    setSelectedAnchors(prev => prev.filter(b => b !== bookToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAnchor(customBookInput);
    }
  };

  useEffect(() => {
    if (step !== 3) return;

    const sequence = [
      "Consulting the archives...",
      selectedGenres.length > 0 ? `Analyzing your interest in ${selectedGenres[0]}...` : "Analyzing reading preferences...",
      "Cross-referencing benchmark titles...",
      "Merging collaborative reading patterns...",
      "Filtering optimal matches...",
      "Curating your personal selection..."
    ];
    
    let i = 0;

    setTimeout(() => {
      setLoadingPhrase(sequence[0]);
      setLoadingProgress((1 / sequence.length) * 100);
    }, 0);

    const interval = setInterval(() => {
      i++;
      if (i < sequence.length) {
        setLoadingPhrase(sequence[i]);
        setLoadingProgress(((i + 1) / sequence.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(() => onMatrixCalibrated(selectedAnchors), 600);
      }
    }, 700); 
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="w-full max-w-3xl mx-auto my-auto animate-fade-in flex flex-col justify-center">
      
      {step > 0 && (
        <div className="relative max-w-xs mx-auto mb-8 px-4 animate-fade-in w-full">
          <div className="flex items-center justify-between relative z-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 ${step >= num ? 'bg-accent text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {step > num ? <CheckCircle2 className="w-4 h-4" /> : `0${num}`}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute left-[15%] right-[15%] top-[15px] h-[1px] bg-white/10 -z-10">
            <div className="h-full bg-accent transition-all duration-700" style={{ width: `${(step - 1) * 50}%` }}></div>
          </div>
        </div>
      )}

      {step === 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-12 backdrop-blur-xl flex flex-col items-center text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,229,255,0.15)] relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
            <BookMarked className="w-7 h-7 text-accent relative z-10" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            Find Your Next Great Book
          </h2>
          <p className="text-sm md:text-base text-gray-400 mb-8 max-w-lg leading-relaxed">
            Reading is a deeply personal journey. Instead of relying on mass-market trends, tell us about the stories that have moved you. We'll use your favorites to hand-pick a beautifully curated selection of books, chosen specifically for you.
          </p>
          <button 
            onClick={() => setStep(1)}
            aria-label="Begin curation process"
            className="group w-full max-w-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            Curate My Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-xl animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Library className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-white tracking-tight">Choose Your Interests</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Select up to 3 genres to help us tailor your recommendations.</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {availableGenres.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                aria-pressed={selectedGenres.includes(genre)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selectedGenres.includes(genre) ? 'bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
              >
                {genre}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setStep(2)}
            disabled={selectedGenres.length === 0}
            className="w-full max-w-sm bg-white/10 hover:bg-accent hover:text-black text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            Confirm Genres <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl animate-fade-in flex flex-col items-center text-center shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-white tracking-tight">Set Benchmark Titles</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Search for exactly 2 books you have enjoyed to anchor your matrix.</p>
          
          <div className="w-full max-w-md mb-6">
            <div className="relative group mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              
              <input
                type="text"
                value={customBookInput}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                disabled={selectedAnchors.length >= 2}
                aria-label="Search for a book"
                placeholder={selectedAnchors.length >= 2 ? "Maximum titles selected" : "Search for a book..."}
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent text-white rounded-xl pl-11 pr-4 py-3 transition-all duration-300 text-sm disabled:opacity-50 shadow-inner"
              />
              
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 text-left">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => addAnchor(suggestion)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent focus-visible:outline-none transition-colors border-b border-white/5 last:border-0 truncate flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3 opacity-50" /> {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {selectedAnchors.map((book, idx) => (
                <div key={idx} className="flex items-center justify-between bg-accent/10 border border-accent/30 text-accent px-4 py-2.5 rounded-lg text-sm font-semibold shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                  <span className="truncate">{book}</span>
                  <button 
                    onClick={() => removeAnchor(book)} 
                    aria-label={`Remove ${book}`}
                    className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {selectedAnchors.length < 2 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Or choose a quick suggestion:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableBooks.filter(b => !selectedAnchors.includes(b)).map(book => (
                    <button
                      key={book}
                      onClick={() => addAnchor(book)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                      {book}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full max-w-md mt-2">
            <button 
              onClick={() => setStep(1)}
              className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={() => setStep(3)}
              disabled={selectedAnchors.length !== 2}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              Generate <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-12 animate-fade-in shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full animate-pulse"></div>
              <Sparkles className="w-10 h-10 text-accent relative z-10 animate-bounce" />
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-wide text-center">
              Curating Your Library
            </h3>
            
            <div className="h-6 flex items-center justify-center w-full mb-8">
              <p className="text-sm text-gray-400 font-medium text-center animate-pulse">
                {loadingPhrase}
              </p>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8 border border-white/10" role="progressbar" aria-valuenow={loadingProgress} aria-valuemin={0} aria-valuemax={100}>
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            <button 
              onClick={onReset}
              className="group flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-600 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Cancel Process
            </button>
          </div>
        </div>
      )}

    </div>
  );
}