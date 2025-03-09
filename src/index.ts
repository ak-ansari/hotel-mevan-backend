import express from "express"
import cors from "cors"
import { commonMiddleware, errorHandler,} from "./utils";
import userRouter from "./modules/Auth/auth.routes";
import printRoutes from "express-list-endpoints";
import hotelRouter from "./modules/hotel/hotel.routes";
const app = express();

const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(commonMiddleware);
app.use("/auth", userRouter);
app.use("/hotel", hotelRouter);
async function init(){
    try {
        app.listen(PORT, (err)=> {
            if(err) throw err;
            console.log(`Server is running on port ${PORT}`);
           const allRoutes= printRoutes(app);
           console.table(allRoutes);
        });
    } catch (error) {
        process.exit(1);
    }
}
app.use(errorHandler)
init();
