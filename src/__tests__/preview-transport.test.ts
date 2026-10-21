import { expect, it, vi } from 'vitest';
import { fetchPreviewRequest } from '../../e2e/preview-transport';

const origin = 'https://example-preview.vercel.app';
it('recovers one dropped page connection and forces manual redirects', async () => {
  const send = vi.fn<typeof fetch>().mockRejectedValueOnce(new TypeError('Connection dropped'))
    .mockResolvedValue(new Response('ok'));
  const retries: string[] = [];
  const result = await fetchPreviewRequest(origin, origin + '/history', {}, send, kind => retries.push(kind));
  expect(await result.text()).toBe('ok');
  expect(send).toHaveBeenCalledTimes(2);
  expect(send.mock.calls.every(call => call[1]?.redirect === 'manual')).toBe(true);
  expect(retries).toEqual(['navigation-transport-retry']);
});
it('never replays API calls or POST bodies after a connection failure', async () => {
  for (const [path, method] of [['/api/ai/rewrite', 'POST'], ['/api/analyze', 'GET'], ['/history', 'POST']]) {
    const send = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Connection dropped'));
    await expect(fetchPreviewRequest(origin, origin + path, { method }, send)).rejects.toThrow();
    expect(send).toHaveBeenCalledTimes(1);
  }
});
it('does not retry HTTP failures, redirects, or an aborted request', async () => {
  for (const status of [302, 401, 403, 429, 503]) {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status }));
    expect((await fetchPreviewRequest(origin, origin + '/history', {}, send)).status).toBe(status);
    expect(send).toHaveBeenCalledTimes(1);
  }
  const send = vi.fn<typeof fetch>().mockRejectedValue(new Error('Aborted'));
  await expect(fetchPreviewRequest(origin, origin + '/history', { signal: AbortSignal.abort() }, send)).rejects.toThrow();
  expect(send).toHaveBeenCalledTimes(1);
});
it('rejects another origin before sending credentials and bounds repeated failures', async () => {
  const send = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Connection dropped'));
  await expect(fetchPreviewRequest(origin, 'https://other.example/', {}, send)).rejects.toThrow('origin mismatch');
  expect(send).not.toHaveBeenCalled();
  await expect(fetchPreviewRequest(origin, origin + '/_next/static/chunk.js', {}, send)).rejects.toThrow();
  expect(send).toHaveBeenCalledTimes(2);
});
