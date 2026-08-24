// Client-side Web Audio API Sound Generator for Binaural Focus Beats and Ambient Noise

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: {
    sourceNode?: AudioNode;
    gainNode?: GainNode;
    carrierOsc?: OscillatorNode;
    modOsc?: OscillatorNode;
    leftOsc?: OscillatorNode;
    rightOsc?: OscillatorNode;
    noiseBuffer?: AudioBufferSourceNode;
  } = {};
  private currentTrack: string | null = null;
  private volume: number = 0.3;

  private initContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.activeNodes.gainNode && this.ctx) {
      this.activeNodes.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    try {
      if (this.activeNodes.carrierOsc) this.activeNodes.carrierOsc.stop();
      if (this.activeNodes.modOsc) this.activeNodes.modOsc.stop();
      if (this.activeNodes.leftOsc) this.activeNodes.leftOsc.stop();
      if (this.activeNodes.rightOsc) this.activeNodes.rightOsc.stop();
      if (this.activeNodes.noiseBuffer) this.activeNodes.noiseBuffer.stop();
    } catch {
      // Ignore if already stopped
    }
    this.activeNodes = {};
    this.currentTrack = null;
  }

  public playTrack(trackId: string): boolean {
    this.stop();
    this.initContext();
    if (!this.ctx) return false;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.gainNode = masterGain;

    this.currentTrack = trackId;

    switch (trackId) {
      case 'binaural_alpha':
        this.createBinauralBeats(200, 10, masterGain); // 10Hz Alpha Waves (Relaxed Alertness)
        break;
      case 'binaural_gamma':
        this.createBinauralBeats(240, 40, masterGain); // 40Hz Gamma Waves (High Intensity Focus & Memory)
        break;
      case 'rain_sound':
        this.createRainGenerator(masterGain);
        break;
      case 'brown_noise':
        this.createBrownNoise(masterGain);
        break;
      case 'pink_noise':
        this.createPinkNoise(masterGain);
        break;
      case 'zen_drone':
        this.createZenHarmonics(masterGain);
        break;
      default:
        this.createPinkNoise(masterGain);
    }

    return true;
  }

  private createBinauralBeats(baseFreq: number, beatFreq: number, dest: AudioNode) {
    if (!this.ctx) return;
    
    // Stereo merger for Left/Right ears
    const merger = this.ctx.createChannelMerger(2);
    
    // Left ear oscillator
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    oscLeft.connect(merger, 0, 0);

    // Right ear oscillator
    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);
    oscRight.connect(merger, 0, 1);

    merger.connect(dest);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.leftOsc = oscLeft;
    this.activeNodes.rightOsc = oscRight;
  }

  private createPinkNoise(dest: AudioNode) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(dest);
    whiteNoise.start();

    this.activeNodes.noiseBuffer = whiteNoise;
  }

  private createBrownNoise(dest: AudioNode) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.3; // volume scale
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.connect(dest);
    brownNoise.start();

    this.activeNodes.noiseBuffer = brownNoise;
  }

  private createRainGenerator(dest: AudioNode) {
    if (!this.ctx) return;
    // Pink noise filtered through lowpass and gentle resonance for steady soothing rain
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.04;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(dest);
    rainSource.start();

    this.activeNodes.noiseBuffer = rainSource;
  }

  private createZenHarmonics(dest: AudioNode) {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(108, this.ctx.currentTime); // Sacred OM tuning (108Hz)
    osc2.frequency.setValueAtTime(216, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(dest);
    gain2.connect(dest);

    osc1.start();
    osc2.start();

    this.activeNodes.carrierOsc = osc1;
    this.activeNodes.modOsc = osc2;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }
}

export const soundEngine = new SoundEngine();
