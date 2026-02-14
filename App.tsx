
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { TRIP_DATA } from './constants';
import { getTravelTips } from './services/gemini';
import { DayPlan, Location } from './types';
import L from 'leaflet';
import { QRCodeSVG } from 'qrcode.react';

// Icons as pure functional components
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Share = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const Sparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;

const MapView: React.FC<{ day: DayPlan }> = ({ day }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true
    }).setView([35.6895, 139.6917], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OSM'
    }).addTo(map);

    mapRef.current = map;

    const coords = day.locations.map(loc => loc.coords);
    const bounds = L.latLngBounds([]);

    day.locations.forEach((loc, idx) => {
      bounds.extend(loc.coords);
      L.marker(loc.coords, {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-8 h-8 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transform transition-transform active:scale-125">${idx + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      })
      .addTo(map)
      .bindPopup(`
        <div class="p-2 min-w-[140px] text-center">
          <h5 class="font-bold text-slate-900 leading-tight mb-1 text-sm">${loc.name}</h5>
          <span class="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 mb-2">${loc.time || '--:--'}</span>
          <p class="text-[11px] text-slate-600 line-clamp-2">${loc.description}</p>
        </div>
      `, {
        closeButton: false,
        offset: [0, -20]
      });
    });

    if (coords.length > 1) {
      L.polyline(coords, {
        color: '#f43f5e',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);
    }

    if (coords.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [day]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-slate-100 bg-slate-100" />;
};

const App: React.FC = () => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [tips, setTips] = useState<Record<number, string>>({});
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useState<'itinerary' | 'map'>('itinerary');

  const activeDay = TRIP_DATA.schedule[activeDayIdx];

  const shareUrl = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      if (url.protocol === 'blob:') return url.href;
      url.searchParams.set('day', (activeDayIdx + 1).toString());
      return url.toString();
    } catch (e) {
      return window.location.href;
    }
  }, [activeDayIdx]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dayParam = params.get('day');
      if (dayParam) {
        const dayIdx = parseInt(dayParam) - 1;
        if (dayIdx >= 0 && dayIdx < TRIP_DATA.schedule.length) {
          setActiveDayIdx(dayIdx);
        }
      }
    } catch (e) {
      console.warn("Search param parsing failed", e);
    }
  }, []);

  const handleDayChange = (idx: number) => {
    setActiveDayIdx(idx);
    try {
      const url = new URL(window.location.href);
      if (url.protocol === 'blob:') return;
      url.searchParams.set('day', (idx + 1).toString());
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.debug("History API navigation skipped", e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const currentIdx = activeDayIdx;
    
    const fetchTips = async () => {
      if (tips[currentIdx] || isLoadingTips) return;
      
      setIsLoadingTips(true);
      try {
        const day = TRIP_DATA.schedule[currentIdx];
        if (!day) return;
        const result = await getTravelTips(day.title, day.locations.map(l => l.name));
        if (isMounted) {
          setTips(prev => ({ ...prev, [currentIdx]: result }));
        }
      } catch (e) {
        console.error("Failed to fetch tips", e);
      } finally {
        if (isMounted) {
          setIsLoadingTips(false);
        }
      }
    };

    fetchTips();
    return () => { isMounted = false; };
  }, [activeDayIdx]);

  const handleShareAction = () => {
    if (navigator.share) {
      navigator.share({
        title: TRIP_DATA.title,
        text: `這是我們第 ${activeDayIdx + 1} 天的行程：${activeDay.title}。快來看看！`,
        url: shareUrl,
      }).catch(err => {
        console.log('Share error', err);
        setShowShareModal(true);
      });
    } else {
      setShowShareModal(true);
    }
  };

  if (!activeDay) return null;

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-50 text-slate-900 selection:bg-rose-100">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 safe-top">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-bold serif-jp">{TRIP_DATA.title}</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Travel Log • 2025</p>
          </div>
          <button 
            onClick={() => setShowShareModal(true)}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all active:scale-90"
          >
            <Share />
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-3 gap-3">
          {TRIP_DATA.schedule.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => handleDayChange(idx)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all duration-300 ${
                activeDayIdx === idx 
                ? 'bg-rose-500 text-white shadow-xl shadow-rose-200 -translate-y-1' 
                : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              <span className="text-[9px] font-black opacity-60">DAY</span>
              <span className="text-lg font-black tracking-tighter leading-none my-0.5">{idx + 1}</span>
              <span className="text-[9px] font-medium opacity-80">{day.date}</span>
            </button>
          ))}
        </div>
      </header>

      <section className="relative h-56 w-full overflow-hidden bg-slate-200">
        <img 
          src={`https://images.unsplash.com/photo-${['1493976040374-85c8e12f0c0e', '1540959733332-e94e270b4052', '1524413840807-0c3cb6fa808d', '1503899036084-c55cdd92da26', '1490730141103-6ca3d7a8caaf', '1554797589-7241bb691973'][activeDayIdx % 6]}?auto=format&fit=crop&q=80&w=1200`}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6">
          <div className="w-full flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-sm uppercase tracking-widest">Active Trip</span>
                <span className="text-[10px] text-white/70 font-bold">{activeDay.date}</span>
              </div>
              <h2 className="text-2xl font-black text-white serif-jp leading-tight">{activeDay.title}</h2>
            </div>
            <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20">
               <button 
                onClick={() => setViewMode('itinerary')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'itinerary' ? 'bg-white text-slate-900' : 'text-white/70'}`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
               </button>
               <button 
                onClick={() => setViewMode('map')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white text-slate-900' : 'text-white/70'}`}
               >
                 <MapPin />
               </button>
            </div>
          </div>
        </div>
      </section>

      <main className="px-5 py-7 space-y-9 relative z-10">
        {viewMode === 'map' ? (
          <div className="h-[65vh] relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-0 bg-slate-100">
             <MapView day={activeDay} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[2rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-4 text-rose-500 font-black text-sm tracking-wide">
                <Sparkles />
                <h3>導遊私房筆記</h3>
              </div>
              {isLoadingTips ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3.5 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-3.5 bg-slate-100 rounded-full w-4/5"></div>
                </div>
              ) : (
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                  {tips[activeDayIdx] || "導覽載入中..."}
                </p>
              )}
            </div>
            <div className="space-y-7">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">本日行程清單</h3>
              <div className="relative space-y-10 before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-rose-200 before:via-slate-100 before:to-transparent">
                {activeDay.locations.map((loc, i) => (
                  <div key={loc.id} className="relative flex items-start group">
                    <div className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-slate-100 shadow-md z-10">
                       <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className="ml-14 flex-1">
                      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-rose-500/60 uppercase tracking-widest">
                        <Clock />
                        <span>{loc.time}</span>
                      </div>
                      <div className="bg-white rounded-[1.5rem] p-5 shadow-lg border border-slate-50">
                        <div className="flex gap-5">
                          <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-base mb-1.5 leading-tight">{loc.name}</h4>
                            <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{loc.description}</p>
                          </div>
                          <img src={loc.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt={loc.name} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">{loc.category}</span>
                          <button onClick={() => setViewMode('map')} className="text-rose-500 font-black text-[10px]">在地圖查看</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-2xl px-6 py-4 rounded-[2rem] shadow-2xl flex justify-around items-center">
        <button onClick={() => setViewMode('itinerary')} className={`flex flex-col items-center gap-1.5 ${viewMode === 'itinerary' ? 'text-rose-400' : 'text-slate-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span className="text-[9px] font-black uppercase tracking-widest">行程</span>
        </button>
        <button onClick={() => setViewMode('map')} className={`flex flex-col items-center gap-1.5 ${viewMode === 'map' ? 'text-rose-400' : 'text-slate-500'}`}>
          <MapPin />
          <span className="text-[9px] font-black uppercase tracking-widest">探索</span>
        </button>
        <button onClick={handleShareAction} className="flex flex-col items-center gap-1.5 text-slate-500">
          <Share />
          <span className="text-[9px] font-black uppercase tracking-widest">分享</span>
        </button>
      </footer>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-md p-4" onClick={() => setShowShareModal(false)}>
          <div className="w-full max-w-sm bg-white rounded-[3rem] p-9 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
            <div className="text-center mb-9">
              <h3 className="text-2xl font-black text-slate-900 mb-2 serif-jp">與旅伴同步</h3>
              <p className="text-[13px] text-slate-400 font-medium px-4">掃描二維碼或點擊按鈕複製連結</p>
            </div>
            <div className="flex justify-center mb-9 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
               <QRCodeSVG value={shareUrl} size={200} level={"H"} includeMargin={true} fgColor="#0f172a" />
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(shareUrl); alert('🔗 連結已複製！'); }}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black shadow-xl"
            >
              複製分享連結
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-div-icon { background: none !important; border: none !important; }
        .safe-top { padding-top: env(safe-area-inset-top); }
        .leaflet-popup-content-wrapper { border-radius: 1.5rem !important; }
        .leaflet-popup-tip-container { display: none; }
      `}</style>
    </div>
  );
};

export default App;
