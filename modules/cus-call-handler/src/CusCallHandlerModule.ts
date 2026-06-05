import { NativeModule, requireNativeModule } from 'expo';

import type { NativeCallLogEntry } from './CusCallHandler.types';

declare class CusCallHandlerModule extends NativeModule {
  load(limit: number): Promise<NativeCallLogEntry[]>;
}

export default requireNativeModule<CusCallHandlerModule>('CusCallHandler');
