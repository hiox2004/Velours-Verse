/**
 * Ambient Sound Synthesizer using Web Audio API
 * Fully offline, zero external audio dependencies or broken URLs.
 */

export type AmbientSoundMode = 'off' | 'rain' | 'cafe' | 'vinyl';

class SoundStudio {
  private ctx: AudioContext | null = null;
  private currentMode: AmbientSoundMode = 'off';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getMode(): AmbientSoundMode {
    return this.currentMode;
  }

  public getCurrentMode(): AmbientSoundMode {
    return this.currentMode;
  }

  public stop() {
    this.currentMode = 'off';
    this.cleanupNodes();
  }

  private cleanupNodes() {
    this.activeNodes.forEach(node => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // Ignore disconnection cleanup errors
        }
      }
    });
    this.activeNodes = [];
  }

  public play(mode: AmbientSoundMode) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentMode === mode) {
      return;
    }

    this.stop();
    this.currentMode = mode;

    if (mode === 'rain') {
      this.playRain();
    } else if (mode === 'cafe') {
      this.playCafe();
    } else if (mode === 'vinyl') {
      this.playVinyl();
    }
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Generate 5-second pink noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to sound like soft rainfall against window glass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.8, ctx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, filter, rainGain);
  }

  private playCafe() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Gentle warm background café murmur: layered filtered brown noise & subtle chords
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    // Warm undertone hum (like a distant espresso machine and cozy chatter)
    const hum = ctx.createOscillator();
    hum.type = 'sine';
    hum.frequency.setValueAtTime(130, ctx.currentTime);
    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.04, ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    hum.connect(humGain);
    humGain.connect(this.masterGain);

    noise.start();
    hum.start();

    this.activeNodes.push(noise, filter, hum, humGain);
  }

  private playVinyl() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Warm 50Hz vinyl rumble
    const rumble = ctx.createOscillator();
    rumble.type = 'triangle';
    rumble.frequency.setValueAtTime(55, ctx.currentTime);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.03, ctx.currentTime);
    rumble.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    rumble.start();
    this.activeNodes.push(rumble, rumbleGain);

    // High frequency micro crackle pulses
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentMode !== 'vinyl') return;
      if (Math.random() > 0.4) {
        try {
          const crackle = this.ctx.createBufferSource();
          const singleBuffer = this.ctx.createBuffer(1, 128, this.ctx.sampleRate);
          const chan = singleBuffer.getChannelData(0);
          for (let j = 0; j < 128; j++) {
            chan[j] = (Math.random() * 2 - 1) * Math.exp(-j / 20);
          }
          crackle.buffer = singleBuffer;

          const crackleGain = this.ctx.createGain();
          crackleGain.gain.setValueAtTime(0.02 + Math.random() * 0.05, this.ctx.currentTime);

          const hpFilter = this.ctx.createBiquadFilter();
          hpFilter.type = 'highpass';
          hpFilter.frequency.setValueAtTime(3000, this.ctx.currentTime);

          crackle.connect(hpFilter);
          hpFilter.connect(crackleGain);
          crackleGain.connect(this.masterGain);

          crackle.start();
        } catch {
          // ignore
        }
      }
    }, 70);

    this.activeNodes.push(interval);
  }
}

export const soundStudio = new SoundStudio();
