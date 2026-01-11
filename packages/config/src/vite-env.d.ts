/// <reference types="vite/client" />

/**
 * Type declarations for Vite's import.meta.env
 *
 * This file provides type information for import.meta.env when Vite types
 * are not available. In projects using Vite, these types are provided by
 * vite/client.
 */

interface ImportMetaEnv {
  [key: string]: string | undefined
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
