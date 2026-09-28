import { QuestionItem, ExperimentScenario, ProcessStep } from '../types';

export const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 1,
    question: 'Fotosentez için güneş ışığının temel görevi nedir?',
    options: [
      { key: 'A', text: 'Kloroplastın sıcaklığını sabit tutmak' },
      { key: 'B', text: 'Klorofildeki elektronları uyararak enerji akışını başlatmak' },
      { key: 'C', text: 'Karbondioksiti doğrudan glikoza bağlamak' }
    ],
    correctKey: 'B',
    explanation: 'Işık fotonları klorofil pigmentleri tarafından soğurulur ve reaksiyon merkezindeki elektronları uyararak fırlatır; böylece ışığa bağımlı reaksiyonlar başlar.'
  },
  {
    id: 2,
    question: 'Fotosentez sırasında atmosfere verilen oksijenin (O₂) kaynağı nedir?',
    options: [
      { key: 'A', text: 'Karbondioksit (CO₂)' },
      { key: 'B', text: 'Su (H₂O)' },
      { key: 'C', text: 'Glikoz (C₆H₁₂O₆)' }
    ],
    correctKey: 'B',
    explanation: 'Su, tilakoit lümende fotoliz ile parçalanır (H₂O → 2H⁺ + 2e⁻ + ½O₂). Açığa çıkan oksijen yan ürün olarak atmosfere salınır.'
  },
  {
    id: 3,
    question: 'Elektron Taşıma Sistemi’nin (ETS) fotosentezdeki temel işlevlerinden biri nedir?',
    options: [
      { key: 'A', text: 'Elektronları taşırken tilakoit lümende proton (H⁺) gradyanı oluşturmak' },
      { key: 'B', text: 'Glikozu parçalayarak enerji açığa çıkarmak' },
      { key: 'C', text: 'Karbondioksiti doğrudan emmek' }
    ],
    correctKey: 'A',
    explanation: 'Elektronlar ETS taşıyıcıları üzerinden akarken serbest kalan enerji ile protonlar (H⁺) lümene pompalanır ve elektrokimyasal bir gradyan kurulur.'
  },
  {
    id: 4,
    question: 'Işıklı evrede ATP molekülü hangi mekanizma ile sentezlenir?',
    options: [
      { key: 'A', text: 'Güneş ışığının doğrudan kimyasal bağa dönüşmesiyle' },
      { key: 'B', text: 'Lümendeki H⁺ iyonlarının ATP sentaz enziminden geçişiyle (Kemiozmoz)' },
      { key: 'C', text: 'Calvin döngüsünde CO₂ parçalanmasıyla' }
    ],
    correctKey: 'B',
    explanation: 'Lümende biriken yüksek derişimli H⁺ iyonları ATP sentazın kanalından stromaya geri akarken enzimin motorunu döndürür ve ADP + Pi → ATP üretilir.'
  },
  {
    id: 5,
    question: 'Calvin döngüsünde harcanan ATP ve NADPH molekülleri nereden gelir?',
    options: [
      { key: 'A', text: 'Tilakoit zardaki ışığa bağımlı reaksiyonlardan' },
      { key: 'B', text: 'Bitkinin köklerinden emilen sudan' },
      { key: 'C', text: 'Hücre çekirdeğinde yapılan solunumdan' }
    ],
    correctKey: 'A',
    explanation: 'ATP ve NADPH, tilakoit zarda fotofosforilasyon ve elektron aktarımı ile sentezlenip stromaya difüze olur; Calvin döngüsünde organik madde yapımında tüketilir.'
  },
  {
    id: 6,
    question: 'Karbondioksit (CO₂) fotosentezin hangi aşamasında kullanılır?',
    options: [
      { key: 'A', text: 'Suyun fotolizi sırasında tilakoit lümende' },
      { key: 'B', text: 'Calvin döngüsünde kloroplast stromasında' },
      { key: 'C', text: 'Fotosistem II’de elektron koparılırken' }
    ],
    correctKey: 'B',
    explanation: 'CO₂, stromada 5 karbonlu RuBP molekülüne Rubisco enzimi ile bağlanarak karbon fiksasyonu safhasında döngüye girer.'
  },
  {
    id: 7,
    question: 'Bitki yeterli CO₂ ve suya sahipken ışık şiddeti çok azalırsa ne beklenir?',
    options: [
      { key: 'A', text: 'Işık reaksiyonları duracağı için ATP ve NADPH yetersizleşir, fotosentez hızı düşer' },
      { key: 'B', text: 'Calvin döngüsü ışıksız ortamda daha hızlı çalışır' },
      { key: 'C', text: 'Oksijen çıkışı iki katına çıkar' }
    ],
    correctKey: 'A',
    explanation: 'Işık azaldığında fotoliz ve fotofosforilasyon yavaşlar. Calvin döngüsü doğrudan ışık istemese de, ihtiyaç duyduğu ATP ve NADPH gelmediği için fotosentez hızı düşer.'
  },
  {
    id: 8,
    question: 'Ortamdaki su miktarı kritik seviyede azalırsa fotosentezin hangi bölümü doğrudan etkilenir?',
    options: [
      { key: 'A', text: 'Işıklı evredeki suyun fotolizi ve elektron temini' },
      { key: 'B', text: 'Sadece yaprağın renginin sararması' },
      { key: 'C', text: 'Hiçbir bölümü etkilenmez, bitki CO₂ ile devam eder' }
    ],
    correctKey: 'A',
    explanation: 'Su azaldığında FS II’nin kaybettiği elektronları tamamlayacak fotoliz gerçekleşemez; elektron akışı ve proton gradyanı kesintiye uğrar.'
  },
  {
    id: 9,
    question: 'Pigmentlerin (klorofil ve karotenoidler) fotosentezdeki temel görevi nedir?',
    options: [
      { key: 'A', text: 'Hücre zarını darbelerden korumak' },
      { key: 'B', text: 'Farklı dalga boylarındaki ışığı absorbe edip enerjiyi reaksiyon merkezine aktarmak' },
      { key: 'C', text: 'Glikozu nişastaya çevirmek' }
    ],
    correctKey: 'B',
    explanation: 'Pigmentler fotonları yakalar. Rezonans aktarımıyla bu enerjiyi reaksiyon merkezine ileterek elektron fırlatılmasını sağlar.'
  },
  {
    id: 10,
    question: 'Fotosentezin iki ana evresi (Işıklı Evre ve Calvin Döngüsü) birbirine nasıl bağlanır?',
    options: [
      { key: 'A', text: 'Tamamen bağımsız iki ayrı süreçtir, aralarında madde alışverişi yoktur' },
      { key: 'B', text: 'Işıklı evre ATP ve NADPH üretir; Calvin döngüsü bunları tüketip ADP ve NADP⁺ olarak geri yollar' },
      { key: 'C', text: 'Sadece gece ve gündüz sırayla çalışarak' }
    ],
    correctKey: 'B',
    explanation: 'Fotosentez entegre bir sistemdir: Işıklı evrede üretilen ATP (enerji) ve NADPH (indirgeme gücü) stromaya geçer; harcandıktan sonra geri dönüştürülmek üzere tilakoite geri döner.'
  }
];

export const EXPERIMENT_SCENARIOS: ExperimentScenario[] = [
  {
    id: 'low_light',
    name: 'Az Işık',
    description: 'Işık şiddeti düşük, CO₂ ve su yüksek.',
    light: 20,
    water: 80,
    co2: 80,
    expectedRate: 'Düşük',
    limitingFactor: 'Işık Şiddeti',
    explanation: 'Su ve CO₂ bol olmasına rağmen foton yetersizliği nedeniyle ATP ve NADPH üretimi sınırlanır (Sınırlayıcı Faktör: Işık).'
  },
  {
    id: 'low_co2',
    name: 'Az CO₂',
    description: 'Işık ve su bol, ancak ortamda CO₂ yetersiz.',
    light: 85,
    water: 85,
    co2: 15,
    expectedRate: 'Düşük',
    limitingFactor: 'CO₂ Derişimi',
    explanation: 'Işıklı evre tam kapasite çalışsa bile Calvin döngüsünde fiksasyon için karbon kaynağı bulunamadığından fotosentez hızı kısıtlanır.'
  },
  {
    id: 'low_water',
    name: 'Az Su (Kuraklık)',
    description: 'Işık ve CO₂ yüksek, su yetersiz.',
    light: 85,
    water: 15,
    co2: 85,
    expectedRate: 'Düşük',
    limitingFactor: 'Su Miktarı',
    explanation: 'Su azaldığında fotoliz duraklar; elektron açığı kapatılamaz ve lümende proton gradyanı kurulamaz.'
  },
  {
    id: 'optimal',
    name: 'Uygun Koşullar',
    description: 'Işık, CO₂ ve su dengeli ve yüksek seviyede.',
    light: 80,
    water: 80,
    co2: 80,
    expectedRate: 'Yüksek',
    limitingFactor: 'Yok (Optimum Düzey)',
    explanation: 'Tüm hammaddeler yeterli olduğundan elektronlar hızla akar, ATP sentezlenir ve Calvin döngüsü maksimum hızda şeker üretir.'
  }
];

export const PROCESS_STEPS_DATA: ProcessStep[] = [
  {
    id: 1,
    title: '1. Işık Pigmentlere Ulaşır',
    focusArea: 'light_source',
    description: 'Güneş fotonları tilakoit zardaki klorofil ve yardımcı pigmentler tarafından soğurulur.'
  },
  {
    id: 2,
    title: '2. Fotosistem II’de Elektronlar Uyarılır',
    focusArea: 'ps2',
    description: 'Soğurulan ışık enerjisi klorofildeki elektronu yüksek enerji düzeyine fırlatır.'
  },
  {
    id: 3,
    title: '3. Suyun Fotolizi Gerçekleşir',
    focusArea: 'photolysis',
    description: 'Su molekülü parçalanır (H₂O → 2H⁺ + 2e⁻ + ½O₂). Elektronlar kaybedilen elektronların yerine geçer; O₂ atmosfere çıkar.'
  },
  {
    id: 4,
    title: '4. Elektronlar ETS Boyunca İlerler',
    focusArea: 'ets',
    description: 'Elektronlar taşıyıcılar üzerinden akarken serbest kalan enerji ile stromadan lümene H⁺ pompalanır.'
  },
  {
    id: 5,
    title: '5. Protonlar Lümende Birikir',
    focusArea: 'ets',
    description: 'Tilakoit iç boşluğunda (lümen) yüksek hidrojen iyonu (H⁺) gradyanı depolanır.'
  },
  {
    id: 6,
    title: '6. ATP Sentaz Çalışır (ATP Oluşur)',
    focusArea: 'atp_synthase',
    description: 'H⁺ iyonları ATP sentaz üzerinden stromaya akarken ADP + Pi birleşir ve ATP sentezlenir.'
  },
  {
    id: 7,
    title: '7. Fotosistem I’de Yeniden Işık Soğurulur',
    focusArea: 'ps1',
    description: 'İkinci bir fotonla elektronlar tekrar uyarılır ve Ferredoksine aktarılır.'
  },
  {
    id: 8,
    title: '8. NADPH İndirgenmesi',
    focusArea: 'nadph',
    description: 'Elektronlar ve stromadaki protonlar NADP⁺ ile birleşerek yüksek enerjili NADPH oluşturur.'
  },
  {
    id: 9,
    title: '9. ATP ve NADPH Calvin Döngüsüne Gider',
    focusArea: 'calvin',
    description: 'Işıklı evrenin ürünleri stromaya difüze olarak şeker yapımında kullanılmak üzere döngüye katılır.'
  },
  {
    id: 10,
    title: '10. CO₂ Döngüye Girer (Karbon Fiksasyonu)',
    focusArea: 'calvin',
    description: 'Havadaki karbondioksit molekülü 5 karbonlu bileşiğe bağlanarak organik karbon iskeletini kurar.'
  },
  {
    id: 11,
    title: '11. Organik Madde (Glikoz) Sentezlenir',
    focusArea: 'glucose',
    description: 'ATP enerjisi ve NADPH indirgeme gücü ile G3P üzerinden glikoz ve diğer besinler üretilir.'
  }
];
