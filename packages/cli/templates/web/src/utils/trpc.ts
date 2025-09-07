// Import tRPC client utilities from shared package
export { 
  trpc, 
  createTRPCClient, 
  createVanillaTRPCClient 
} from '@{{workspaceScope}}/shared';
export type { TRPCClientConfig, AppRouter } from '@{{workspaceScope}}/shared'; 