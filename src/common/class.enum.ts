export enum SeatClass {
  ECONOMY = 'Economy',
  BUSINESS = 'Business',
  VIP = 'VIP',
}

export const SeatCapacity: Record<string, Record<SeatClass, number>> = {
  'Boeing 747': {
    [SeatClass.ECONOMY]: 200,
    [SeatClass.BUSINESS]: 50,
    [SeatClass.VIP]: 10,
  },
  'Airbus A380': {
    [SeatClass.ECONOMY]: 300,
    [SeatClass.BUSINESS]: 70,
    [SeatClass.VIP]: 15,
  },
  'Boeing 777': {
    [SeatClass.ECONOMY]: 250,
    [SeatClass.BUSINESS]: 60,
    [SeatClass.VIP]: 12,
  },
};