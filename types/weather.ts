// /types/weather.ts
export interface Weather {
    name: string;
    main: { temp: number };
    weather: { description: string }[];
    error?: boolean; // Optional field to indicate fetch failure
  }