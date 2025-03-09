import { Router } from "express";
import { book, getHotelById, getHotels } from "./hotel.controller";

const hotelRouter = Router();

hotelRouter.get("/", getHotels);
hotelRouter.get("/:id", getHotelById);
hotelRouter.post("/booking", book);
export default hotelRouter;
