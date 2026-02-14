
import { TripData } from './types';

export const TRIP_DATA: TripData = {
  title: "2025 日本冬日紀行",
  startDate: "2025-02-05",
  endDate: "2025-02-10",
  schedule: [
    {
      date: "2/5",
      title: "富士山脈動之始",
      locations: [
        { id: "1-1", name: "海老名服務區", description: "關東最著名的服務區，必買蜜瓜包與炸雞。", time: "10:00", category: "food", imageUrl: "https://picsum.photos/seed/ebina/800/600", coords: [35.4528, 139.3941] },
        { id: "1-2", name: "本町通富士道", description: "著名的昭和風情街道，與富士山的絕佳構圖地點。", time: "13:30", category: "sightseeing", imageUrl: "https://picsum.photos/seed/honmachi/800/600", coords: [35.4925, 138.8044] },
        { id: "1-3", name: "新屋山神社", description: "日本第一財運神社，祈求事業與財富。", time: "15:30", category: "sightseeing", imageUrl: "https://picsum.photos/seed/arayasans/800/600", coords: [35.4741, 138.8083] }
      ]
    },
    {
      date: "2/6",
      title: "河口湖湖畔漫步",
      locations: [
        { id: "2-1", name: "河口湖 Lawson", description: "網紅打卡點，富士山與便利商店的神奇交匯。", time: "09:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/lawson/800/600", coords: [35.4984, 138.7686] },
        { id: "2-2", name: "河口湖自然生活館", description: "大石公園旁，拍攝逆富士與四季花卉的最佳場所。", time: "11:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/nature/800/600", coords: [35.5228, 138.7494] },
        { id: "2-3", name: "忍野八海", description: "富士山融雪湧出的八座天然池塘，清澈見底。", time: "14:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/oshino/800/600", coords: [35.4604, 138.8328] },
        { id: "2-4", name: "新倉山淺間公園", description: "五重塔與富士山的經典名信片風景。", time: "16:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/chureito/800/600", coords: [35.5011, 138.8015] }
      ]
    },
    {
      date: "2/7",
      title: "魔幻影視之旅",
      locations: [
        { id: "3-1", name: "豐島園區", description: "抵達寧靜的練馬區，準備進入魔法世界。", time: "10:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/toshimaen/800/600", coords: [35.7441, 139.6572] },
        { id: "3-2", name: "哈利波特影城", description: "全球規模最大的華納兄弟哈利波特影城。", time: "11:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/potter/800/600", coords: [35.7441, 139.6572] },
        { id: "3-3", name: "新宿", description: "東京最繁忙的樞紐，晚餐與購物天堂。", time: "17:00", category: "shopping", imageUrl: "https://picsum.photos/seed/shinjuku/800/600", coords: [35.6905, 139.7020] },
        { id: "3-4", name: "晴空塔", description: "在東京第一高塔觀賞璀璨夜景。", time: "20:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/skytree/800/600", coords: [35.7101, 139.8107] }
      ]
    },
    {
      date: "2/8",
      title: "東京經典與靈性",
      locations: [
        { id: "4-1", name: "築地市場", description: "品嚐最鮮美的海鮮早餐與玉子燒。", time: "08:00", category: "food", imageUrl: "https://picsum.photos/seed/tsukiji/800/600", coords: [35.6655, 139.7704] },
        { id: "4-2", name: "東京鐵塔", description: "東京的永恆象徵，拍照打卡的經典位置。", time: "10:30", category: "sightseeing", imageUrl: "https://picsum.photos/seed/tokyotower/800/600", coords: [35.6586, 139.7454] },
        { id: "4-3", name: "豪德寺", description: "招福貓的發源地，滿坑滿谷的貓咪公仔極其療癒。", time: "13:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/cat/800/600", coords: [35.6483, 139.6473] },
        { id: "4-4", name: "明治神宮", description: "隱身於都市森林中的莊嚴神社。", time: "15:30", category: "sightseeing", imageUrl: "https://picsum.photos/seed/meiji/800/600", coords: [35.6764, 139.6993] },
        { id: "4-5", name: "澀谷", description: "十字路口與SHIBUYA SKY，體驗東京脈動。", time: "18:00", category: "shopping", imageUrl: "https://picsum.photos/seed/shibuya/800/600", coords: [35.6580, 139.7016] }
      ]
    },
    {
      date: "2/9",
      title: "夢幻海洋盛典",
      locations: [
        { id: "5-1", name: "東京迪士尼海洋", description: "全球唯一以海洋為主題的迪士尼樂園，充滿奇幻感。", time: "08:30", category: "sightseeing", imageUrl: "https://picsum.photos/seed/disney/800/600", coords: [35.6267, 139.8851] }
      ]
    },
    {
      date: "2/10",
      title: "下町江戶情懷",
      locations: [
        { id: "6-1", name: "淺草雷門", description: "巨型紅燈籠，東京最具代表性的地標。", time: "09:00", category: "sightseeing", imageUrl: "https://picsum.photos/seed/asakusa/800/600", coords: [35.7110, 139.7963] },
        { id: "6-2", name: "仲見世通", description: "古色古香的商店街，挑選伴手禮與品嚐小吃。", time: "10:00", category: "shopping", imageUrl: "https://picsum.photos/seed/nakamise/800/600", coords: [35.7118, 139.7964] },
        { id: "6-3", name: "淺草今半", description: "百年壽喜燒老店，品嚐頂級黑毛和牛。", time: "12:00", category: "food", imageUrl: "https://picsum.photos/seed/imahan/800/600", coords: [35.7121, 139.7946] },
        { id: "6-4", name: "成田/羽田機場", description: "帶著滿滿的回憶踏上歸途。", time: "15:00", category: "transport", imageUrl: "https://picsum.photos/seed/airport/800/600", coords: [35.7720, 140.3929] }
      ]
    }
  ]
};
