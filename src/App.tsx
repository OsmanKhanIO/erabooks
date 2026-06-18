import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ResultsBoard } from './components/features/ResultsBoard';
import { OnboardingMatrix } from './components/features/OnboardingMatrix';
import { ErrorState } from './components/ui/ErrorState';

function App() {
  const [resetKey, setResetKey] = useState(0);
  
  // Set the dynamic API URL based on your .env file, falling back to localhost for local dev
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
  // UPGRADE: Enterprise Data Fetching with TanStack Query
  const searchMutation = useMutation({
    mutationFn: async (anchors: string[]) => {
      const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/recommend/${encodeURIComponent(anchors[0])}`),
        fetch(`${API_URL}/recommend/${encodeURIComponent(anchors[1])}`)
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Our library database currently has no record of this specific title. Please go back and proceed with a different selection.");
      }

      const data1 = await res1.json();
      const data2 = await res2.json();

      const combined = [...data1.recommendations, ...data2.recommendations];

      const uniqueMap = new Map();
      combined.forEach(book => {
        if (!uniqueMap.has(book[0])) {
          uniqueMap.set(book[0], book);
        }
      });

      // Returning top 12 matches for the responsive grid
      return Array.from(uniqueMap.values()).slice(0, 12);
    }
  });

  const resetEngine = () => {
    searchMutation.reset(); // Clears the mutation state (errors, success, etc.)
    setResetKey(prev => prev + 1); // Forces the OnboardingMatrix to remount from Step 0
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-gray-200 font-sans selection:bg-accent selection:text-black relative flex flex-col overflow-x-hidden">
      
      {/* Studio-Grade Background Lighting */}
      <div className="absolute top-0 left-[-10%] w-[150%] md:w-[50%] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[150%] md:w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Inline SVG Data URI for the Noise Texture - Bulletproof no 404s */}
      <div 
        className="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none w-full h-full z-0"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      ></div>

      <div className="relative z-10 w-full flex flex-col items-center pt-14 md:pt-20 px-4 md:px-8">
        <Header onReset={resetEngine} />
      </div>

      <main className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 md:px-8 pb-16">
        
        {/* UPGRADE: Exclusive rendering logic. Ensures UI states NEVER overlap. */}
        {searchMutation.isError ? (
          <ErrorState 
            message={searchMutation.error.message} 
            onReset={resetEngine} 
          />
        ) : searchMutation.isSuccess && searchMutation.data.length > 0 ? (
          <ResultsBoard 
            recommendations={searchMutation.data} 
            searchedBook="Custom Blended Matrix" 
            onReset={resetEngine} 
          />
        ) : (
          <OnboardingMatrix 
            key={resetKey} 
            onMatrixCalibrated={(anchors) => searchMutation.mutate(anchors)} 
            onReset={resetEngine} 
          />
        )}

      </main>

      <Footer />
      
    </div>
  );
}

export default App;