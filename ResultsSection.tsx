import React, { useState } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Layers,
  Crown,
  Shuffle,
  AlertCircle,
  X,
  Dices,
} from 'lucide-react';
import { Group } from '../types';
import { GroupCard } from './GroupCard';
import { motion, AnimatePresence } from 'motion/react';

interface ResultsSectionProps {
  groups: Group[];
  onRollRoles: (groupId: string, rolesInput: string) => void;
  onUpdateGroupName: (groupId: string, newName: string) => void;
  onPromoteLeader: (groupId: string, memberId: string) => void;
  onRollAllRoles: (rolesInput: string) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  groups,
  onRollRoles,
  onUpdateGroupName,
  onPromoteLeader,
  onRollAllRoles,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [globalRoleInput, setGlobalRoleInput] = useState('');

  const totalMembers = groups.reduce((acc, g) => acc + g.members.length, 0);

  // Filter groups or members based on search term
  const filteredGroups = groups.map((g) => {
    if (!searchTerm.trim()) return g;
    const matchingMembers = g.members.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...g, members: matchingMembers };
  }).filter((g) => g.members.length > 0 || !searchTerm.trim());

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-100 to-emerald-100 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner mb-4 ring-8 ring-indigo-50/50">
          <Users className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">
          Chưa có nhóm nào được chia
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Hãy dán danh sách tên ở Cột Trái, chọn số lượng nhóm và bấm nút{' '}
          <span className="font-bold text-indigo-600">"Shuffle & Assign Groups"</span> để hệ thống ngẫu nhiên rải đều nhóm & bốc Nhóm trưởng 👑!
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Thuật toán Fisher-Yates 100% ngẫu nhiên & công bằng</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top Header Controls in Right Column */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Kết quả Phân nhóm</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {groups.length} nhóm
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {totalMembers} người
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mỗi nhóm đã có 1 Nhóm trưởng 👑. Bạn có thể lắc vai trò tùy chỉnh cho các nhóm phía dưới.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên thành viên/vai trò..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Global Quick Action: Roll Roles for ALL Groups at once */}
      <div className="bg-gradient-to-r from-indigo-900 to-emerald-900 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl shrink-0 mt-0.5">
            <Dices className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Phân vai trò cho TẤT CẢ các nhóm ⚡
            </h4>
            <p className="text-xs text-indigo-200">
              Áp dụng cùng một bộ vai trò (ví dụ: "Thư ký, Thuyết trình, Phản biện") cho tất cả các nhóm cùng lúc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <input
            type="text"
            value={globalRoleInput}
            onChange={(e) => setGlobalRoleInput(e.target.value)}
            placeholder="VD: Thư ký, Thuyết trình..."
            className="px-3 py-1.5 text-xs bg-white/10 text-white placeholder-indigo-200 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-48"
          />
          <button
            type="button"
            onClick={() => {
              if (globalRoleInput.trim()) {
                onRollAllRoles(globalRoleInput);
              }
            }}
            disabled={!globalRoleInput.trim()}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/20 text-indigo-950 font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            Áp dụng tất cả
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center text-slate-500 text-sm">
          Không tìm thấy thành viên nào khớp với từ khóa "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <GroupCard
                  group={group}
                  groupIndex={index}
                  onRollRoles={onRollRoles}
                  onUpdateGroupName={onUpdateGroupName}
                  onPromoteLeader={onPromoteLeader}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
