export function createClickPlayer(
  makeContext: () => AudioContext | undefined = () => {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    return AudioCtx ? new AudioCtx() : undefined;
  }
) {
  let sharedCtx: AudioContext | undefined;

  function getAudioContext(): AudioContext | undefined {
    if (!sharedCtx || sharedCtx.state === 'closed') {
      sharedCtx = makeContext();
    }
    return sharedCtx;
  }

  return async function playClickSound() {
    let ctx: AudioContext | undefined;

    try {
      ctx = getAudioContext();
      if (!ctx) return;

      // Resume from the click gesture, including Safari's interrupted state.
      if (ctx.state !== 'running') {
        await ctx.resume();
      }
      if (ctx.state !== 'running') return;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      oscillator.start(now);
      oscillator.stop(now + 0.04);
    } catch {
      // Discard a failed context so the next click can try a fresh one.
      if (ctx && sharedCtx === ctx) {
        sharedCtx = undefined;
        void ctx.close().catch(() => {});
      }
    }
  };
}

export const playClickSound = createClickPlayer();
