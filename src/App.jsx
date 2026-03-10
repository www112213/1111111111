/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, ArrowLeft, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedGame(null);
    setIsFullScreen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleBack}
          >
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Unblocked Games</h1>
          </div>

          {!selectedGame && (
            <div className="relative w-full max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-zinc-800 border-zinc-700 border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {selectedGame && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-none" />
                </motion.div>
              ))}
              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-zinc-500 text-lg">No games found matching your search.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedGame.title}</h2>
                  <p className="text-zinc-400">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div 
                className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 transition-all duration-500 ${
                  isFullScreen ? 'fixed inset-0 z-[100] rounded-none' : 'aspect-video'
                }`}
              >
                {isFullScreen && (
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-4 right-4 z-[101] p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">How to play</h4>
                <p className="text-zinc-300">
                  Most games use the <span className="text-emerald-400 font-mono">WASD</span> or <span className="text-emerald-400 font-mono">Arrow Keys</span> for movement. 
                  Use <span className="text-emerald-400 font-mono">Space</span> or <span className="text-emerald-400 font-mono">Mouse Click</span> for actions.
                  If the game doesn't load, try opening it in a new tab using the icon above.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-zinc-800 py-12 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold">Unblocked Games Hub</span>
          </div>
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Unblocked Games Hub. All games are property of their respective owners.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
