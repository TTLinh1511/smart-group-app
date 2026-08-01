import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { Group } from './types';
import {
  parseNameList,
  assignGroups,
  rollRolesForGroup,
  exportToCSV,
  formatGroupsForClipboard,
  SAMPLE_NAME_LISTS,
} from './utils/shuffle';

export default function App() {
  // Initial default sample names
  const defaultSample = SAMPLE_NAME_LISTS[0].names.join('\n');
  const [rawNames, setRawNames] = useState<string>(defaultSample);
  const [groupCount, setGroupCount] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto initialize groups on initial load for smooth immediate preview
  useEffect(() => {
    const initialNames = parseNameList(defaultSample);
    const initialGroups = assignGroups(initialNames, 4);
    setGroups(initialGroups);
  }, []);

  // Handler: Main "Shuffle & Assign Groups"
  const handleShuffleAndAssign = () => {
    const names = parseNameList(rawNames);
    if (names.length === 0) return;

    setIsShuffling(true);

    setTimeout(() => {
      const newGroups = assignGroups(names, groupCount);
      setGroups(newGroups);
      setIsShuffling(false);
    }, 350);
  };

  // Handler: Phase 2 Role Assignment for a single group
  const handleRollRoles = (groupId: string, rolesInput: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === groupId) {
          return rollRolesForGroup(g, rolesInput);
        }
        return g;
      })
    );
  };

  // Handler: Phase 2 Role Assignment for ALL groups at once
  const handleRollAllRoles = (rolesInput: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => rollRolesForGroup(g, rolesInput))
    );
  };

  // Handler: Update group name
  const handleUpdateGroupName = (groupId: string, newName: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  };

  // Handler: Promote specific member as leader
  const handlePromoteLeader = (groupId: string, memberId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupId) return g;
        const updatedMembers = g.members.map((m) => {
          if (m.id === memberId) {
            return { ...m, isLeader: true, role: 'Nhóm trưởng' };
          }
          if (m.isLeader) {
            return { ...m, isLeader: false, role: 'Thành viên' };
          }
          return m;
        });
        return { ...g, members: updatedMembers };
      })
    );
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    exportToCSV(groups);
  };

  // Handler: Copy summary text to clipboard
  const handleCopySummary = () => {
    const text = formatGroupsForClipboard(groups);
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Input Area (4 columns on lg) */}
          <div className="lg:col-span-5">
            <InputSection
              rawNames={rawNames}
              setRawNames={setRawNames}
              groupCount={groupCount}
              setGroupCount={setGroupCount}
              onShuffleAndAssign={handleShuffleAndAssign}
              onExportCSV={handleExportCSV}
              onCopySummary={handleCopySummary}
              hasGroups={groups.length > 0}
              isShuffling={isShuffling}
              copied={copied}
            />
          </div>

          {/* Right Column: Results & Phase 2 Area (7 columns on lg) */}
          <div className="lg:col-span-7">
            <ResultsSection
              groups={groups}
              onRollRoles={handleRollRoles}
              onUpdateGroupName={handleUpdateGroupName}
              onPromoteLeader={handlePromoteLeader}
              onRollAllRoles={handleRollAllRoles}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Smart Group Assigner — Công cụ chia nhóm thông minh.</p>
          <p className="text-slate-400">Thiết kế với React 19, Tailwind CSS & Motion.</p>
        </div>
      </footer>
    </div>
  );
}
