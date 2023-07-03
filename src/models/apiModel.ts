export type Sensor = {
  id: string;
  ts: string;
  value: number;
};

export type Platform = {
  id: string;
  name: string;
  fleet: string;
  img: string;
  lastReport: string;
  sensors: Sensor[];
};
