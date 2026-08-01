import { Group, Member } from '../types';

/**
 * Modern Fisher-Yates (Knuth) Shuffle algorithm.
 * Guarantees 100% unbiased uniform random permutation in O(n) time.
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Parses raw newline-separated text into clean non-empty name strings.
 */
export function parseNameList(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/**
 * Phase 1 Logic:
 * 1. Shuffles name list 100% randomly with Fisher-Yates.
 * 2. Distributes names into numGroups evenly (max size difference is 1).
 * 3. Pick EXACTLY 1 random person per group as "Nhóm trưởng" (Leader).
 * 4. Remaining members get "Thành viên" (Member).
 */
export function assignGroups(names: string[], numGroups: number): Group[] {
  if (names.length === 0 || numGroups <= 0) return [];

  // 1. Shuffle all names randomly
  const shuffledNames = fisherYatesShuffle(names);

  // 2. Initialize group buckets
  const actualGroupCount = Math.min(numGroups, names.length);
  const groups: Group[] = Array.from({ length: actualGroupCount }, (_, i) => ({
    id: `group-${Date.now()}-${i + 1}`,
    name: `Nhóm ${i + 1}`,
    members: [],
    customRoleInput: '',
  }));

  // Distribute items round-robin or bucket-style
  shuffledNames.forEach((name, index) => {
    const groupIndex = index % actualGroupCount;
    groups[groupIndex].members.push({
      id: `mem-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      isLeader: false,
      role: 'Thành viên',
    });
  });

  // 3. For EACH group, pick EXACTLY 1 random member as "Nhóm trưởng"
  groups.forEach((group) => {
    if (group.members.length > 0) {
      const leaderIndex = Math.floor(Math.random() * group.members.length);
      group.members[leaderIndex].isLeader = true;
      group.members[leaderIndex].role = 'Nhóm trưởng';
    }
  });

  return groups;
}

/**
 * Phase 2 Logic:
 * Given a group and comma-separated custom roles string (e.g. "Thư ký, Thuyết trình, Phản biện"):
 * 1. Takes non-leader members ("Thành viên").
 * 2. Parses and cleans custom roles.
 * 3. Randomly assigns custom roles to non-leaders.
 * 4. Absolutely preserves the Leader ("Nhóm trưởng") intact.
 */
export function rollRolesForGroup(group: Group, customRolesInput: string): Group {
  const parsedRoles = customRolesInput
    .split(/[,;\n]+/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  if (parsedRoles.length === 0) {
    // Reset non-leader roles back to default "Thành viên"
    return {
      ...group,
      customRoleInput: customRolesInput,
      members: group.members.map((m) =>
        m.isLeader ? m : { ...m, role: 'Thành viên' }
      ),
    };
  }

  // Separate leader and non-leaders
  const nonLeaderIndices: number[] = [];
  group.members.forEach((m, idx) => {
    if (!m.isLeader) {
      nonLeaderIndices.push(idx);
    }
  });

  if (nonLeaderIndices.length === 0) return group;

  // Shuffle roles OR shuffle non-leaders
  const shuffledRoles = fisherYatesShuffle(parsedRoles);
  const shuffledNonLeaderIndices = fisherYatesShuffle(nonLeaderIndices);

  const updatedMembers = [...group.members];

  // Reset non-leaders to "Thành viên" first
  shuffledNonLeaderIndices.forEach((idx) => {
    updatedMembers[idx] = { ...updatedMembers[idx], role: 'Thành viên' };
  });

  // Assign roles randomly
  shuffledNonLeaderIndices.forEach((memberIdx, roleIdx) => {
    if (roleIdx < shuffledRoles.length) {
      updatedMembers[memberIdx] = {
        ...updatedMembers[memberIdx],
        role: shuffledRoles[roleIdx],
      };
    }
  });

  return {
    ...group,
    customRoleInput: customRolesInput,
    members: updatedMembers,
  };
}

/**
 * Exports group assignments to CSV with UTF-8 BOM encoding for Excel compatibility.
 */
export function exportToCSV(groups: Group[]) {
  if (groups.length === 0) return;

  const headers = ['Tên Nhóm', 'STT', 'Họ và Tên', 'Vai Trò', 'Nhóm Trưởng?'];
  const rows: string[][] = [headers];

  groups.forEach((group) => {
    group.members.forEach((member, index) => {
      rows.push([
        `"${group.name.replace(/"/g, '""')}"`,
        (index + 1).toString(),
        `"${member.name.replace(/"/g, '""')}"`,
        `"${member.role.replace(/"/g, '""')}"`,
        member.isLeader ? 'Có (👑)' : 'Không',
      ]);
    });
  });

  const csvContent = rows.map((r) => r.join(',')).join('\n');
  // UTF-8 BOM byte sequence \uFEFF ensures Vietnamese characters display correctly in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Ket_Qua_Chia_Nhom_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats group results as readable text for copying into chat applications.
 */
export function formatGroupsForClipboard(groups: Group[]): string {
  if (groups.length === 0) return '';

  let text = `📋 KẾT QUẢ CHIA NHÓM (Tổng số: ${groups.reduce((acc, g) => acc + g.members.length, 0)} người - ${groups.length} nhóm)\n\n`;

  groups.forEach((group) => {
    text += `🔹 ${group.name.toUpperCase()} (${group.members.length} thành viên):\n`;
    group.members.forEach((m) => {
      const leaderBadge = m.isLeader ? '👑 [Nhóm Trưởng]' : `[${m.role}]`;
      text += `  • ${m.name} - ${leaderBadge}\n`;
    });
    text += '\n';
  });

  text += `⚡ Đã tạo bằng Smart Group Assigner vào ${new Date().toLocaleTimeString('vi-VN')}`;
  return text;
}

/**
 * Sample name presets for quick testing.
 */
export const SAMPLE_NAME_LISTS = [
  {
    title: 'Lớp Học / Sinh Viên (20 người)',
    names: [
      'Nguyễn Văn An',
      'Trần Thị Bích',
      'Lê Hoàng Cường',
      'Phạm Minh Đức',
      'Hoàng Thị Em',
      'Vũ Quốc Phong',
      'Đặng Thu Hà',
      'Bùi Tuấn Anh',
      'Đỗ Ngọc Mai',
      'Hồ Tấn Phát',
      'Nông Khánh Linh',
      'Trịnh Đức Thắng',
      'Phan Hoài Nam',
      'Ngô Hương Giang',
      'Dương Văn Khoa',
      'Lý Khánh Vân',
      'Nguyễn Bảo Long',
      'Võ Thị Như Quỳnh',
      'Đào Văn Hùng',
      'Trương Kiều Trang',
    ],
  },
  {
    title: 'Dự Án Công Ty / Phòng Ban (12 người)',
    names: [
      'Lê Tuấn Kiệt (PM)',
      'Nguyễn Hoài Thương (Designer)',
      'Trần Bảo Nam (Dev)',
      'Phạm Thanh Tùng (QA)',
      'Hoàng Nhật Minh (Dev)',
      'Đặng Kim Oanh (Marketing)',
      'Vũ Hải Đăng (Backend)',
      'Bùi Tuyết Mai (Content)',
      'Ngô Gia Huy (DevOps)',
      'Phan Ngọc Trinh (HR)',
      'Trịnh Hồng Sơn (Data)',
      'Đỗ Phương Thảo (BA)',
    ],
  },
];
