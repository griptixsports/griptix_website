export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  role: UserRole;
  created_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
}

export interface AnatomicalProfile {
  id: string;
  user_id: string;
  hand_length_mm?: number;
  hand_width_mm?: number;
  grip_circumference_mm?: number;
  dominant_hand: "left" | "right";
  sport_discipline: string;
  finger_reach_mm?: number;
  notes: string;
  verified_by_coach: boolean;
  created_at: string;
}
