export interface AdminUserMock {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Suspended";
  lastActive: string;
}

export const MOCK_USERS: AdminUserMock[] = [
  {
    id: "usr_101",
    name: "Eleanor Vance",
    email: "eleanor.vance@infurnus.org",
    role: "Super Admin",
    status: "Active",
    lastActive: "2 mins ago",
  },
  {
    id: "usr_102",
    name: "Julian Thorne",
    email: "j.thorne@infurnus.org",
    role: "System Admin",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "usr_103",
    name: "Clara Sterling",
    email: "clara.s@infurnus.org",
    role: "Content Moderator",
    status: "Pending",
    lastActive: "Yesterday",
  },
  {
    id: "usr_104",
    name: "Harrison Brooks",
    email: "h.brooks@infurnus.org",
    role: "Audit Lead",
    status: "Suspended",
    lastActive: "3 days ago",
  },
];
