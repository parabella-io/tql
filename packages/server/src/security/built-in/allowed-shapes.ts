import { TQLServerError, TQLServerErrorType } from '../../errors.js';
import type { QueryPlan } from '../plan.js';
import type { SecurityLogger } from '../config.js';
import type { SecurityPolicy } from '../policy.js';
import { assertQueryNodeAllowed, type AllowedShapesMap } from '../shape-subset.js';

export type AllowedShapesPolicyOptions = {
  shapes: AllowedShapesMap;
  mode?: 'enforce' | 'warn';
  logger?: SecurityLogger;
};

export const allowedShapesPolicy = (options: AllowedShapesPolicyOptions): SecurityPolicy => ({
  name: 'allowed-shapes',
  beforeQuery(_ctx, plan) {
    for (const node of plan.nodes) {
      const result = assertQueryNodeAllowed(node, options.shapes[node.queryName]);

      if (result.allowed) {
        continue;
      }

      const details = {
        queryName: result.queryName,
        path: result.path,
        reason: result.reason,
      };

      if ((options.mode ?? 'enforce') === 'warn') {
        options.logger?.warn?.({ details }, '[tql] query shape is not allowed');
        continue;
      }

      throw new TQLServerError(TQLServerErrorType.SecurityShapeNotAllowedError, details);
    }
  },
});

