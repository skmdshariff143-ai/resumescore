import { expect, it } from 'vitest';
import nextConfig from '../../next.config';

it('locks paid AI off in compiled deployments independently of remote configuration', () => {
  expect(nextConfig.env?.AI_PAID_ENABLED).toBe('false');
});
