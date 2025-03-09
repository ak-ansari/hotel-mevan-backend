import { Router, Response, Request } from "express";
import { ApiError, asyncWrapper } from "../../utils";
import { promises } from "fs";
import path from "path";
import { IHotel, IHotelBooking } from "../../interface";
import PrismaClient from "../../db/db";
const getHotels = asyncWrapper(async (req: Request, res: Response) => {
  const hotels = await parseHotelData();
  res.status(200).json(hotels);
});
const book = asyncWrapper(async (req: Request, res: Response) => {
  const bookingData = req.body as IHotelBooking;
  const hotel = await searchHotel(bookingData.hotelId);
  if (!hotel) throw new Error("Hotel not found");
  if (hotel.availableRooms <= 0) throw new Error("Hotel is fully booked");
  const savedData = await PrismaClient.booking.create({
    data: {
      hotelId: bookingData.hotelId,
      userId: req.userInfo.id,
      aadhaars: bookingData.aadhaars,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
    },
  });
  res.status(201).json(savedData);
});
const getHotelById = asyncWrapper(async(req: Request,res: Response)=>{
    const hotelId = parseInt(req.params.id);
    const hotel = await searchHotel(hotelId);
    if (!hotel) throw new ApiError(404,"Hotel not found");
    res.status(200).json(hotel);
  });
async function searchHotel(id: number): Promise<IHotel> {
  try {
    const hotels = await parseHotelData();
    const hotel = hotels.find(h => h.id === id);
    return hotel;
  } catch (error) {
    throw error;
  }
}

async function parseHotelData(): Promise<IHotel[]> {
  try {
    const filePath = path.resolve(__dirname, "../../assets/hotels.json");
    const hotel = await promises.readFile(filePath, { encoding: "utf-8" });
    return JSON.parse(hotel) as IHotel[];
  } catch (error) {
    throw error;
  }
}
export { getHotels, book ,getHotelById};
