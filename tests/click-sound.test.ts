import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createClickPlayer } from '@/lib/click-sound';

function audioContext(state = 'running') {
  const nodes: {
    disconnected: boolean;
    stopped: boolean;
    onended?: () => void;
  }[] = [];
  const param = { setValueAtTime() {}, exponentialRampToValueAtTime() {} };
  const ctx = {
    state,
    currentTime: 0,
    destination: {},
    async resume() {
      ctx.state = 'running';
    },
    async close() {
      ctx.state = 'closed';
    },
    createOscillator() {
      const node = {
        type: '',
        frequency: param,
        disconnected: false,
        stopped: false,
        onended: undefined as (() => void) | undefined,
        connect() {},
        disconnect() {
          node.disconnected = true;
        },
        start() {},
        stop() {
          node.stopped = true;
        },
      };
      nodes.push(node);
      return node;
    },
    createGain() {
      return { gain: param, connect() {}, disconnect() {} };
    },
  };
  return { ctx, nodes, asAudioContext: () => ctx as unknown as AudioContext };
}

test('every click creates a fresh sound and releases its nodes', async () => {
  const audio = audioContext();
  const play = createClickPlayer(audio.asAudioContext);
  for (let i = 0; i < 10; i++) await play();
  assert.equal(audio.nodes.length, 10);
  audio.nodes.forEach(node => {
    node.onended?.();
    assert.equal(node.stopped && node.disconnected, true);
  });
});

test('sound recovers from suspension, Safari interruption and closed context', async () => {
  const contexts = [audioContext('suspended'), audioContext()];
  let created = 0;
  const play = createClickPlayer(() => contexts[created++].asAudioContext());
  await play();
  contexts[0].ctx.state = 'interrupted';
  await play();
  contexts[0].ctx.state = 'closed';
  await play();
  assert.equal(created, 2);
  assert.equal(contexts[0].nodes.length, 2);
  assert.equal(contexts[1].nodes.length, 1);
});

test('resume rejection does not break counting and next gesture can retry', async () => {
  const failed = audioContext('suspended');
  failed.ctx.resume = async () => {
    throw new Error('denied');
  };
  const recovered = audioContext();
  let created = 0;
  const play = createClickPlayer(() =>
    (created++ === 0 ? failed : recovered).asAudioContext()
  );
  await assert.doesNotReject(play());
  await play();
  assert.equal(recovered.nodes.length, 1);
  await assert.doesNotReject(createClickPlayer(() => undefined)());
});
