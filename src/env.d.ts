/// <reference types="nativewind/types" />

interface ImportMetaEnv {
  readonly EXPO_PUBLIC_SUPABASE_URL: string;
  readonly EXPO_PUBLIC_SUPABASE_KEY: string;
  readonly EXPO_PUBLIC_ASSEMBLYAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
