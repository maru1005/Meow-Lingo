// src/types/auth.ts
import { User as FirebaseUser } from "firebase/auth";

export type AuthState = {
  user: FirebaseUser | null;
  idToken: string | null;
  loading: boolean;
  initialized: boolean;
  initAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
