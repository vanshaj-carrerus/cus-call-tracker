import { NativeModule, registerWebModule } from 'expo';

import type { NativeCallLogEntry } from './CusCallHandler.types';

class CusCallHandlerModule extends NativeModule {
  async load(_limit: number): Promise<NativeCallLogEntry[]> {
    return [];
  }
}

export default registerWebModule(CusCallHandlerModule, 'CusCallHandler');
