import { useCallSync } from '@/hooks/use-call-sync';

/** Side-effect only: wires background + foreground call-log sync when authenticated. */
export function CallSyncBootstrap() {
  useCallSync();
  return null;
}
