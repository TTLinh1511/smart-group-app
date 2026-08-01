import React from 'react';
import { Users, Shuffle, Crown, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 text-white shadow-lg border-b border-indigo-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-2xl shadow-md ring-2 ring-white/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Smart Group Assigner
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  v2.0
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-0.5">
                Công cụ chia nhóm thông minh, bốc thăm Nhóm trưởng & phân công vai trò tự động
              </p>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <div className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-950/60 text-indigo-200 border border-indigo-700/60 backdrop-blur-sm">
              <Shuffle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Fisher-Yates 100% Random</span>
            </div>
            <div className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-950/60 text-amber-200 border border-amber-500/30 backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>Tự động bầu Nhóm trưởng</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
