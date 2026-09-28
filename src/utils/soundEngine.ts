/**
 * Fotosentez Bilimsel Ses Motoru (Web Audio API)
 * Oyun/arcade sesleri yerine; kısa, biyolojik, enerji hissi veren,
 * bilimsel ve kulak tırmalamayan prosedürel ses efektleri üretir.
 * Sıfır harici dosya bağımlılığı ile her ortamda kesintisiz ve hatasız çalışır.
 */

export type SoundEffectType =
  | 'photon'             // Işık fotonu klorofile çarpar
  | 'electron_excited'   // Elektron uyarılır ve fırlar
  | 'photolysis'         // Suyun fotolizi (parçalanma)
  | 'oxygen_bubble'      // O₂ gazı salınımı (hafif kabarcık)
  | 'ets_pulse'          // Elektronların ETS boyunca akışı (hafif nabız)
  | 'proton_flow'        // H⁺ iyonlarının lümene pompalanması / gradyan
  | 'atp_synthase'       // ATP Sentaz nanomotorunun dönüşü
  | 'atp_synthesized'    // ADP + Pi → ATP oluşumu (tatmin edici kristal enerji)
  | 'nadph_formed'       // NADP⁺ → NADPH indirgenmesi (enerji dolumu)
  | 'calvin_entry'       // CO₂ gazının Calvin döngüsüne girişi (organik akış)
  | 'glucose_formed';    // Glikoz besin sentezi (zengin biyolojik çiçeklenme)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.45; // 0.0 to 1.0 (varsayılan dengeli sınıf seviyesi)
  private lastPlayedTimestamps: Map<SoundEffectType, number> = new Map();

  constructor() {
    // LocalStorage'dan önceki tercihi oku
    try {
      const savedMute = localStorage.getItem('photosynthesis_sound_enabled');
      if (savedMute !== null) {
        this.isEnabled = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('photosynthesis_sound_volume');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
    } catch {
      // LocalStorage kısıtlıysa varsayılanları koru
    }
  }

  /**
   * Kullanıcı ilk kez tıkladığında AudioContext'i başlatır veya uyandırır.
   */
  private initContext(): boolean {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return false;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isEnabled ? this.volume : 0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch {
      return false;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('photosynthesis_sound_enabled', String(enabled));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(enabled ? this.volume : 0, this.ctx.currentTime);
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('photosynthesis_sound_volume', String(this.volume));
    } catch {}

    if (this.masterGain && this.ctx && this.isEnabled) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Aynı sesin üst üste binip karmaşa yaratmasını önleyen akıllı gecikme kontrolü.
   */
  private canPlay(type: SoundEffectType, minIntervalMs: number = 350): boolean {
    if (!this.isEnabled) return false;
    const now = performance.now();
    const last = this.lastPlayedTimestamps.get(type) || 0;
    if (now - last < minIntervalMs) {
      return false;
    }
    this.lastPlayedTimestamps.set(type, now);
    return true;
  }

  /**
   * Ana ses tetikleme fonksiyonu
   */
  public play(type: SoundEffectType) {
    if (!this.isEnabled) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      switch (type) {
        // 1. IŞIK / FOTON: Klorofile ulaşan foton enerjisi (yumuşak, parlak ışıma)
        case 'photon': {
          if (!this.canPlay('photon', 600)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(780, now);
          osc.frequency.exponentialRampToValueAtTime(1180, now + 0.18);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(950, now);
          filter.Q.setValueAtTime(3.0, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.23);
          break;
        }

        // 2. ELEKTRON UYARILMASI: Enerji basamağına yükselme sesi
        case 'electron_excited': {
          if (!this.canPlay('electron_excited', 500)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.exponentialRampToValueAtTime(720, now + 0.16);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.21);
          break;
        }

        // 3. SUYUN FOTOLİZİ: H₂O molekülünün parçalanması (hafif su ayrışması)
        case 'photolysis': {
          if (!this.canPlay('photolysis', 800)) return;
          // Hafif damla/ayrılma tınısı
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1050, now);
          osc.frequency.exponentialRampToValueAtTime(380, now + 0.14);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.17);
          break;
        }

        // 4. O₂ ÇIKIŞI: Gaz kabarcığı / salınım efekti
        case 'oxygen_bubble': {
          if (!this.canPlay('oxygen_bubble', 700)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(940, now + 0.12);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        // 5. ETS PULSE: Elektronların ETS taşıyıcıları üzerinden aralıklı akışı
        case 'ets_pulse': {
          if (!this.canPlay('ets_pulse', 700)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.linearRampToValueAtTime(460, now + 0.08);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        // 6. PROTON GRADYANI: H⁺ iyonlarının lümende birikmesi (derin sıcak rezonans)
        case 'proton_flow': {
          if (!this.canPlay('proton_flow', 900)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(280, now + 0.2);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        // 7. ATP SENTAZ: Nanomotorun proton geçişiyle dönmesi (hafif mekanik-rotary döngü)
        case 'atp_synthase': {
          if (!this.canPlay('atp_synthase', 800)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.18);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);
          filter.Q.setValueAtTime(4.0, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.24);
          break;
        }

        // 8. ATP OLUŞUMU: ADP + Pi → ATP (tatmin edici kristal akor)
        case 'atp_synthesized': {
          if (!this.canPlay('atp_synthesized', 1000)) return;
          // İkili armonik akor (523Hz C5 ve 659Hz E5)
          const freqs = [523.25, 659.25];
          freqs.forEach((freq, idx) => {
            if (!this.ctx || !this.masterGain) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.02);

            gain.gain.setValueAtTime(0.001, now + idx * 0.02);
            gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.02 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.35);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.02);
            osc.stop(now + idx * 0.02 + 0.36);
          });
          break;
        }

        // 9. NADPH OLUŞUMU: Enerji depolama / elektriksel dolum efekti
        case 'nadph_formed': {
          if (!this.canPlay('nadph_formed', 1000)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(620, now + 0.22);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.27);
          break;
        }

        // 10. CALVIN DÖNGÜSÜ GİRİŞİ: CO₂ havadan bağlanır (yumuşak biyolojik geçiş / soluk)
        case 'calvin_entry': {
          if (!this.canPlay('calvin_entry', 1100)) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.linearRampToValueAtTime(320, now + 0.15);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(400, now);
          filter.Q.setValueAtTime(1.5, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.14, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + 0.26);
          break;
        }

        // 11. ORGANİK MADDE / GLİKOZ OLUŞUMU: Besin sentezi (zengin organik büyüme akoru)
        case 'glucose_formed': {
          if (!this.canPlay('glucose_formed', 1400)) return;
          // Zengin doğa akoru (349Hz F4, 440Hz A4, 523Hz C5)
          const notes = [349.23, 440.0, 523.25];
          notes.forEach((note, idx) => {
            if (!this.ctx || !this.masterGain) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note, now + idx * 0.03);

            gain.gain.setValueAtTime(0.001, now + idx * 0.03);
            gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.03 + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.45);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.03);
            osc.stop(now + idx * 0.03 + 0.46);
          });
          break;
        }
      }
    } catch {
      // Ses çalınamazsa uygulama asla çökmez
    }
  }
}

export const soundEngine = new SoundEngine();
