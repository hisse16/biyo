/**
 * Web Speech API (SpeechSynthesis) Doğal Türkçe Seslendirme Motoru
 * 11 Adımlı Fotosentez Süreci için doğal, sıcak ve akıcı Türkçe seslendirme.
 * Robotik tınıyı önlemek için yüksek kaliteli Türkçe sesler (Google / Natural) seçilir,
 * bilimsel semboller Türkçe öğretmen anlatım diline dönüştürülür.
 */

// Chrome Garbage Collection sorununu önlemek için global referans
declare global {
  interface Window {
    __currentUtterance?: SpeechSynthesisUtterance | null;
  }
}

class SpeechService {
  private isSpeaking: boolean = false;
  private onStateChangeListeners: Set<(isSpeaking: boolean) => void> = new Set();
  private keepAliveInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Sesler yüklendiğinde hazır ol
      };
    }
  }

  public subscribe(listener: (isSpeaking: boolean) => void): () => void {
    this.onStateChangeListeners.add(listener);
    listener(this.isSpeaking);
    return () => {
      this.onStateChangeListeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((fn) => fn(speaking));
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Tarayıcıdaki en doğal, yüksek kaliteli Türkçe sesi seçer
   * (Google Türkçe, Microsoft Natural, Apple Yelda/Cem öncelikli)
   */
  private getBestTurkishVoice(): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    const trVoices = voices.filter(
      (v) => v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')
    );

    if (trVoices.length === 0) return null;

    // Kalite sıralaması: Natural / Online / Google / Enhanced en önde
    const ranked = [...trVoices].sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        const n = v.name.toLowerCase();
        if (n.includes('natural') || n.includes('online')) return 5;
        if (n.includes('google')) return 4;
        if (n.includes('premium') || n.includes('enhanced')) return 3;
        if (n.includes('yelda') || n.includes('cem')) return 2;
        return 1;
      };
      return score(b) - score(a);
    });

    return ranked[0] || null;
  }

  /**
   * Bilimsel metinleri doğal, akıcı bir Türkçe öğretmen anlatımına dönüştürür.
   * Robotik heceleme veya anlamsız sembol okumalarını engeller.
   */
  private formatTextForNaturalSpeech(text: string): string {
    return text
      // Denklem ve formülleri akıcı anlatıma çevir
      .replace(/\(H₂O → 2H⁺ \+ 2e⁻ \+ ½O₂\)/g, '(yani su molekülü; hidrojen, elektron ve oksijene ayrışır)')
      .replace(/H₂O → 2H⁺ \+ 2e⁻ \+ ½O₂/g, 'su molekülü; hidrojen, elektron ve oksijene ayrışır')
      .replace(/ADP \+ Pi birleşir/g, 'A-D-P ve inorganik fosfat birleşir')
      .replace(/ADP \+ Pi/g, 'A-D-P ve fosfat')
      .replace(/H₂O/g, 'su')
      .replace(/CO₂/g, 'karbondioksit')
      .replace(/O₂/g, 'oksijen')
      .replace(/C₆H₁₂O₆/g, 'glikoz')
      .replace(/FS I’de/g, 'Fotosistem 1’de')
      .replace(/FS II’de/g, 'Fotosistem 2’de')
      .replace(/FS I/g, 'Fotosistem 1')
      .replace(/FS II/g, 'Fotosistem 2')
      .replace(/H⁺ iyonları/g, 'hidrojen iyonları')
      .replace(/H⁺/g, 'hidrojen')
      .replace(/e⁻/g, 'elektron')
      .replace(/ATP/g, 'A-T-P')
      .replace(/NADPH/g, 'N-A-D-P-H')
      .replace(/NADP⁺/g, 'N-A-D-P artı')
      .replace(/G3P/g, 'G-3-P')
      .replace(/RuBP/g, 'Ru-B-P')
      .replace(/Rubisco/g, 'Rubisko')
      .replace(/→/g, ' sonucunda ')
      .replace(/\//g, ' veya ')
      .trim();
  }

  /**
   * Sadece açıklama metnini doğal tonda okur ve cümle bittiğinde onEndCallback tetikler.
   */
  public speak(rawText: string, onEndCallback?: () => void) {
    if (!this.isSupported()) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stop();

    try {
      const naturalText = this.formatTextForNaturalSpeech(rawText);
      const utterance = new SpeechSynthesisUtterance(naturalText);

      utterance.lang = 'tr-TR';
      // Doğal, sakin ve dinlenebilir öğretmen anlatım temposu
      utterance.rate = 0.90;
      utterance.pitch = 1.0;

      const bestVoice = this.getBestTurkishVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // GC önleme
      window.__currentUtterance = utterance;

      let hasEnded = false;
      const finish = () => {
        if (hasEnded) return;
        hasEnded = true;
        this.clearKeepAlive();
        window.__currentUtterance = null;
        this.notify(false);
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onstart = () => {
        this.notify(true);
        this.startKeepAlive();
      };

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = (e) => {
        // İptal edilmediği sürece bitir
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          finish();
        } else {
          this.notify(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false);
      if (onEndCallback) onEndCallback();
    }
  }

  /**
   * Uzun cümlelerde Chrome'un konuşmayı yarıda duraklatmasını önler
   */
  private startKeepAlive() {
    this.clearKeepAlive();
    this.keepAliveInterval = window.setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private clearKeepAlive() {
    if (this.keepAliveInterval !== null) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Aktif seslendirmeyi durdurur.
   */
  public stop() {
    if (!this.isSupported()) return;
    this.clearKeepAlive();
    try {
      window.speechSynthesis.cancel();
    } catch {}
    window.__currentUtterance = null;
    this.notify(false);
  }
}

export const speechService = new SpeechService();
