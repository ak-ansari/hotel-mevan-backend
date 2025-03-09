export interface IHotelBooking {
  id?: number;
  hotelId: number;
  userId: number;
  aadhaars: string[]; // Array of Aadhaar numbers
  checkInDate: Date;
  checkOutDate: Date;
  bookingDate: Date;
}
export interface IHotel {
  id: number;
  name: string;
  location: string;
  price: number;
  images: string[];
  rating: number;
  availableRooms: number;
  description: string;
}
