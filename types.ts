export interface Member {
  id: string;
  name: string;
  isLeader: boolean;
  role: string; // "Nhóm trưởng" or "Thành viên" or custom role (e.g., "Thư ký", "Thuyết trình")
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  customRoleInput?: string;
}

export interface SamplePreset {
  title: string;
  names: string[];
}
