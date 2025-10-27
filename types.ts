// FIX: Added full content for types.ts, defining all necessary types for the application.
// FIX: Add 'admin' to AppMode to support the admin view.
export type AppMode = 'chat' | 'image' | 'code' | 'plan' | 'search' | 'contextual' | 'admin';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark' | 'system';

export interface HistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface Source {
  uri: string;
  title: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface Subscription {
    isActive: boolean;
    plan: 'free' | 'premium';
    expiryDate?: number;
}

export interface SubscriptionHook {
    subscription: Subscription;
    checkAccess: () => boolean;
    activate: (code: string) => { success: boolean; message: string };
    getUsage: () => { used: number; limit: number };
}