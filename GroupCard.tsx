import React, { useState } from 'react';
import {
  Crown,
  User,
  Dices,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Copy,
  ChevronRight,
  Shield,
  ArrowRightLeft,
} from 'lucide-react';
import { Group, Member } from '../types';

interface GroupCardProps {
  group: Group;
  groupIndex: number;
  onRollRoles: (groupId: string, rolesInput: string) => void;
  onUpdateGroupName: (groupId: string, newName: string) => void;
  onPromoteLeader: (groupId: string, memberId: string) => void;
  onSwapMembers?: (sourceGroupId: string, sourceMemberId: string, targetGroupId: string, targetMemberId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  groupIndex,
  onRollRoles,
  onUpdateGroupName,
  onPromoteLeader,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(group.name);
  const [rolesInput, setRolesInput] = useState(group.customRoleInput || '');
  const [copiedGroup, setCopiedGroup] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Identify leader
  const leader = group.members.find((m) => m.isLeader);
  const nonLeaders = group.members.filter((m) => !m.isLeader);

  const handleTitleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (titleInput.trim()) {
      onUpdateGroupName(group.id, titleInput.trim());
    } else {
      setTitleInput(group.name);
    }
    setIsEditingTitle(false);
  };

  const handleRollClick = () => {
    setIsRolling(true);
    setTimeout(() => {
      onRollRoles(group.id, rolesInput);
      setIsRolling(false);
    }, 250);
  };

  const handleCopyGroup = () => {
    let text = `🔹 ${group.name} (${group.members.length} người):\n`;
    group.members.forEach((m) => {
      const leaderMarker = m.isLeader ? '👑 [Nhóm trưởng]' : `[${m.role}]`;
      text += `  • ${m.name} - ${leaderMarker}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  // Color schemes based on index for lively visually distinct group cards
  const cardThemes = [
    {
      border: 'border-indigo-200 hover:border-indigo-300',
      headerBg: 'bg-gradient-to-r from-indigo-50 to-indigo-100/60 text-indigo-950',
      badge: 'bg-indigo-600 text-white',
      accentText: 'text-indigo-600',
    },
    {
      border: 'border-emerald-200 hover:border-emerald-300',
      headerBg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 text-emerald-950',
      badge: 'bg-emerald-600 text-white',
      accentText: 'text-emerald-600',
    },
    {
      border: 'border-sky-200 hover:border-sky-300',
      headerBg: 'bg-gradient-to-r from-sky-50 to-sky-100/60 text-sky-950',
      badge: 'bg-sky-600 text-white',
      accentText: 'text-sky-600',
    },
    {
      border: 'border-violet-200 hover:border-violet-300',
      headerBg: 'bg-gradient-to-r from-violet-50 to-violet-100/60 text-violet-950',
      badge: 'bg-violet-600 text-white',
      accentText: 'text-violet-600',
    },
    {
      border: 'border-teal-200 hover:border-teal-300',
      headerBg: 'bg-gradient-to-r from-teal-50 to-teal-100/60 text-teal-950',
      badge: 'bg-teal-600 text-white',
      accentText: 'text-teal-600',
    },
  ];

  const theme = cardThemes[groupIndex % cardThemes.length];

  return (
    <div
      className={`bg-white rounded-2xl border ${theme.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group`}
    >
      {/* Top Header */}
      <div>
        <div
          className={`${theme.headerBg} px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2`}
        >
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="px-2.5 py-1 text-sm font-bold bg-white text-slate-900 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                title="Lưu tên"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-extrabold text-base text-slate-900 truncate">
                {group.name}
              </h3>
              <button
                onClick={() => setIsEditingTitle(true)}
                type="button"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-white/60 transition-all cursor-pointer"
                title="Đổi tên nhóm"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}
            >
              {group.members.length} người
            </span>

            <button
              onClick={handleCopyGroup}
              type="button"
              className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
              title="Sao chép danh sách nhóm này"
            >
              {copiedGroup ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Member List */}
        <div className="p-4 space-y-2.5">
          {group.members.map((member, mIdx) => {
            const isLeader = member.isLeader;
            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isLeader
                    ? 'bg-gradient-to-r from-amber-50/90 via-amber-100/40 to-amber-50/80 border-amber-300/80 ring-1 ring-amber-400/30 shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/70 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar / Role Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                      isLeader
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white ring-2 ring-amber-300 animate-pulse'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isLeader ? <Crown className="w-4 h-4 text-white" /> : mIdx + 1}
                  </div>

                  {/* Name and Role */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold text-sm truncate ${
                          isLeader ? 'text-amber-950 font-extrabold' : 'text-slate-900'
                        }`}
                      >
                        {member.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-0.5">
                      {isLeader ? (
                        <span className="inline-flex items-center text-[11px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                          <Crown className="w-3 h-3 mr-1 text-amber-700 fill-amber-500" />
                          Nhóm Trưởng
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            member.role !== 'Thành viên'
                              ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                              : 'bg-slate-200/80 text-slate-600'
                          }`}
                        >
                          {member.role !== 'Thành viên' && (
                            <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                          )}
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Make Leader Action */}
                {!isLeader && (
                  <button
                    onClick={() => onPromoteLeader(group.id, member.id)}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Chọn người này làm Nhóm trưởng"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px]">Làm trưởng</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 2: Role Assignment Box (Bottom of Card) */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 mt-2 space-y-2.5 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <Dices className="w-3.5 h-3.5 text-indigo-600" />
            <span>Phân vai trò tùy chỉnh (Giai đoạn 2):</span>
          </label>
          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
            <Shield className="w-3 h-3 text-amber-500" />
            Giữ nguyên Trưởng 👑
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={rolesInput}
            onChange={(e) => setRolesInput(e.target.value)}
            placeholder="VD: Thư ký, Thuyết trình, Phản biện"
            className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
          />

          <button
            type="button"
            onClick={handleRollClick}
            disabled={isRolling}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
            title="Gán vai trò ngẫu nhiên cho các Thành viên"
          >
            <Dices className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>Roll Roles</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 leading-tight">
          * Nhập các vai trò phân cách bằng dấu phẩy. Hệ thống sẽ gán ngẫu nhiên cho các Thành viên.
        </p>
      </div>
    </div>
  );
};
