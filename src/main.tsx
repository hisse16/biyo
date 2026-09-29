import React,{useEffect,useRef,useState}from"react";
import{createRoot}from"react-dom/client";
import"./index.css";

const stages=[
["Ödev yükleniyor...","Dosyalar kontrol ediliyor...","İçerik hazırlanıyor..."],
["Bir dakika.","Bu sayfayı gerçekten açtınız.","İlginç."],
["Saat 18:07.","Buraya geleceğinizi biliyordum.","Önceki ödevi hatırlıyor musunuz?"],
["Onu size özellikle gösterdim.","Çünkü bakacağınızı biliyordum.","Şimdi biraz daha dikkatli bakın."],
["Ekran değişiyor.","Tarayıcı ayarları kontrol ediliyor...","Bağlantı yeniden kuruluyor..."],
["Bunu kapatmaya çalışmayın.","Henüz bitmedi.","Asıl kısmı şimdi başlıyor."],
["TUZAĞIMA DÜŞTÜNÜZ.","Bunu açan kişi hâlâ burada mı?","Ben yeneceğim."],
];

function tone(ctx,f,d,gain=0.035,type="sine"){
 const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(gain,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+d);
}
function startSound(){
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 const c=new C(); const master=c.createGain();master.gain.value=.055;master.connect(c.destination);
 const osc=c.createOscillator();const g=c.createGain();osc.type="sine";osc.frequency.value=48;g.gain.value=.22;osc.connect(g).connect(master);osc.start();
 let beat=0;const timer=window.setInterval(()=>{beat++;tone(c,62,0.16,.08,"sine");if(beat%2===0)tone(c,110,0.4,.025,"triangle");if(beat>35)clearInterval(timer)},850);
 return()=>{clearInterval(timer);osc.stop();c.close()};
}
function App(){
 const[started,setStarted]=useState(false),[stage,setStage]=useState(0),[line,setLine]=useState(0),[desktop,setDesktop]=useState(false),[flash,setFlash]=useState(false);
 const stopSound=useRef(null);
 useEffect(()=>{if(!started)return;document.title=stage>=5?"DİKKAT — ÖNEMLİ":stage>=2?"Bir şey fark ettiniz mi?":"Fotosentez | İnteraktif Ödev";
   if(stage<stages.length){const t=setTimeout(()=>setLine(x=>x+1),stage===0?850:1250);return()=>clearTimeout(t)}
 },[started,stage]);
 useEffect(()=>{if(line>=stages[stage]?.length&&stage<stages.length-1){const t=setTimeout(()=>{setStage(s=>s+1);setLine(0)},stage>=4?1800:900);return()=>clearTimeout(t)}},[line,stage]);
 const begin=async()=>{setStarted(true);stopSound.current=startSound();try{await document.documentElement.requestFullscreen?.()}catch{}};
 useEffect(()=>{if(stage===4){setDesktop(true);setFlash(true);setTimeout(()=>setFlash(false),180)}},[stage]);
 if(!started)return <main className="normal"><div className="paper"><div className="brand">BİYOLOJİ ÖDEVİ</div><h1>Fotosentez</h1><p>İnteraktif konu anlatımı ve deney simülasyonu</p><button onClick={begin}>Ödevi Aç</button><small>Sayfa tam ekran çalışmak için kullanıcı etkileşimi bekliyor.</small></div></main>;
 return <main className={`scene s${stage} ${flash?"flash":""}`}>
   {desktop&&<div className="desktop"><div className="window"><div className="wbar">Görev Merkezi <span>— □ ×</span></div><div className="wbody"><b>Arka planda çalışan işlemler</b><div className="row">ÖDEV_2026 <i>%{Math.min(100,stage*23+17)}</i></div><div className="row">İçerik doğrulama <i>çalışıyor...</i></div><div className="row">Tarayıcı oturumu <i>aktif</i></div></div></div><div className="taskbar">⊞　Arama　　Ödev　　Tarayıcı　　18:07</div></div>}
   <div className="vignette"/><section className="content"><div className="status">● bağlantı aktif　 /　 oturum: bilinmeyen</div>{stages[stage].slice(0,line).map((x,i)=><p key={i} className={x==="TUZAĞIMA DÜŞTÜNÜZ."?"trap":""}>{x}</p>)}{stage===stages.length-1&&line>=3&&<div className="final"><div>HANGİNİZ AÇTIYSA</div><div>BANA MESAJ ATSIN.</div><hr/><small>Gönderen: <b>Hilmi Selim Şen</b></small></div>}</section>
 </main>
}
createRoot(document.getElementById("root")!).render(<App/>);