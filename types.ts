
export interface Location {
  id: string;
  name: string;
  description: string;
  time?: string;
  category: 'sightseeing' | 'food' | 'shopping' | 'transport';
  imageUrl: string;
  coords: [number, number]; // [lat, lng]
}

export interface DayPlan {
  date: string;
  title: string;
  locations: Location[];
  guideTips?: string;
}

export interface TripData {
  title: string;
  startDate: string;
  endDate: string;
  schedule: DayPlan[];
}
