export class Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];

  constructor() {
    this.id = 0;
    this.title = '';
    this.description = '';
    this.price = 0;
    this.discountPercentage = 0;
    this.rating = 0;
    this.stock = 0;
    this.brand = '';
    this.category = '';
    this.thumbnail = '';
    this.images = [];
  }
}
