import React from 'react';
import {
  Shuffle,
  Download,
  Trash2,
  FileSpreadsheet,
  Users,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { SAMPLE_NAME_LISTS, parseNameList } from '../utils/shuffle';

interface InputSectionProps {
  rawNames: string;
  setRawNames: (val: string) => void;
  groupCount: number;
  setGroupCount: (val: number) => void;
  onShuffleAndAssign: () => void;
  onExportCSV: () => void;
  onCopySummary: () => void;
  hasGroups: boolean;
  isShuffling: boolean;
  copied: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  rawNames,
  setRawNames,
  groupCount,
  setGroupCount,
  onShuffleAndAssign,
  onExportCSV,
  onCopySummary,
  hasGroups,
  isShuffling,
  copied,
}) => {
  const parsedNames = parseNameList(rawNames);
  const totalNames = parsedNames.length;

  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_NAME_LISTS[sampleIndex];
    if (sample) {
      setRawNames(sample.names.join('\n'));
      // Auto adjust group count sensibly
      const suggestedGroups = Math.max(2, Math.round(sample.names.length / 4));
      setGroupCount(suggestedGroups);
    }
  };

  const handleClear = () => {
    setRawNames('');
  };

  // Calculate estimated group sizes
  const avgPerGroup = groupCount > 0 && totalNames > 0 
    ? (totalNames / groupCount).toFixed(1) 
    : '0';
  const minPerGroup = groupCount > 0 ? Math.floor(totalNames / groupCount) : 0;
  const maxPerGroup = groupCount > 0 ? Math.ceil(totalNames / groupCount) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 flex flex-col gap-5">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Khu vực Nhập liệu</h2>
            <p className="text-xs text-slate-500">
              Nhập danh sách tên & chọn số lượng nhóm cần chia
            </p>
          </div>
        </div>

        {totalNames > 0 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Users className="w-3.5 h-3.5 mr-1" />
            {totalNames} người
          </span>
        )}
      </div>

      {/* Preset Data Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs">
        <span className="font-medium text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Nạp mẫu nhanh:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_NAME_LISTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(idx)}
              type="button"
              className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              {sample.title.split(' (')[0]}
            </button>
          ))}
          {totalNames > 0 && (
            <button
              onClick={handleClear}
              type="button"
              className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title="Xóa tất cả danh sách"
            >
              <Trash2 className="w-3 h-3" />
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <label htmlFor="names-textarea" className="flex items-center gap-1.5">
            <span>Danh sách tên thành viên</span>
            <span className="text-rose-500">*</span>
          </label>
          <span className="text-slate-400 font-normal">Mỗi dòng 1 tên</span>
        </div>
        <div className="relative">
          <textarea
            id="names-textarea"
            value={rawNames}
            onChange={(e) => setRawNames(e.target.value)}
            placeholder="Ví dụ:&#10;Nguyễn Văn An&#10;Trần Thị Bích&#10;Lê Hoàng Cường&#10;Phạm Minh Đức&#10;..."
            rows={10}
            className="w-full px-3.5 py-3 text-sm text-slate-800 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all resize-y font-sans placeholder-slate-400 leading-relaxed"
          />
          {totalNames === 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs">
              Dán hoặc gõ danh sách tại đây...
            </div>
          )}
        </div>
      </div>

      {/* Number of Groups Input */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label htmlFor="group-count-input" className="block text-sm font-bold text-indigo-950">
            Số lượng nhóm cần chia:
          </label>
          <p className="text-xs text-indigo-700/80 mt-0.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-indigo-500 inline" />
            {totalNames > 0
              ? `Mỗi nhóm sẽ có từ ${minPerGroup} đến ${maxPerGroup} người (TB: ${avgPerGroup})`
              : 'Hãy nhập danh sách tên phía trên'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setGroupCount(Math.max(1, groupCount - 1))}
            disabled={groupCount <= 1}
            className="w-9 h-9 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer text-lg"
          >
            -
          </button>
          <input
            id="group-count-input"
            type="number"
            min={1}
            max={Math.max(1, totalNames || 100)}
            value={groupCount}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setGroupCount(Math.max(1, val));
            }}
            className="w-16 h-9 text-center font-extrabold text-indigo-900 bg-white border border-indigo-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setGroupCount(groupCount + 1)}
            className="w-9 h-9 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold flex items-center justify-center transition-colors shadow-2xs cursor-pointer text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Main Action Button: Shuffle & Assign Groups */}
        <button
          type="button"
          onClick={onShuffleAndAssign}
          disabled={totalNames === 0 || isShuffling}
          className={`relative w-full py-3.5 px-5 rounded-xl font-extrabold text-white text-base shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer overflow-hidden ${
            totalNames === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 active:scale-[0.99] hover:shadow-indigo-500/25'
          }`}
        >
          <Shuffle
            className={`w-5 h-5 ${
              isShuffling ? 'animate-spin text-amber-300' : 'text-emerald-300'
            }`}
          />
          <span>{isShuffling ? 'Đang Lắc & Chia Nhóm...' : 'Shuffle & Assign Groups'}</span>
          <span className="text-xs font-normal opacity-85 hidden sm:inline">
            (Lắc & Chia Nhóm)
          </span>
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCSV}
            disabled={!hasGroups}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              hasGroups
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 active:scale-98 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
            <span className="text-[10px] text-emerald-700 font-normal">
              (Tải về máy)
            </span>
          </button>

          {/* Copy Results Text Button */}
          <button
            type="button"
            onClick={onCopySummary}
            disabled={!hasGroups}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              hasGroups
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 active:scale-98 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Đã copy kết quả!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-600" />
                <span>Sao chép kết quả</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rules & Footnote */}
      <div className="text-[11px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200/60 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
          <Info className="w-3 h-3 text-indigo-500" /> Quy tắc chia tự động:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
          <li>Xáo trộn 100% ngẫu nhiên theo thuật toán Fisher-Yates.</li>
          <li>Rải đều danh sách (chênh lệch quân số tối đa là 1).</li>
          <li>Mỗi nhóm được bốc thăm ngẫu nhiên <strong>ĐÚNG 1 Nhóm trưởng 👑</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
