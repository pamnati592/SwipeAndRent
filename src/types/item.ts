export type Item = {
  id: string;
  title: string;
  description: string | null;
  daily_price: number;
  sale_price: number | null;
  category: string;
  city: string | null;
  photos: string[] | null;
};
