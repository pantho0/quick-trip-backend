export type TCar = {
  name: string;
  images: string;
  description: string;
  color: string;
  isElectric: boolean;
  status: 'available' | 'booked';
  features: string[];
  pricePerHour: number;
  isDeleted: boolean;
};
