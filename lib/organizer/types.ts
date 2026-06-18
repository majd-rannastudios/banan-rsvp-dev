export type OrganizerRole = "admin" | "checkin_staff" | "broadcast_manager" | "viewer";

export interface OrganizerAccount {
  email: string;
  password: string;
  role: OrganizerRole;
  fullName: string;
}

export interface OrganizerSession {
  email: string;
  role: OrganizerRole;
  fullName: string;
}
