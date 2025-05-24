import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { SeatClassEnum } from "../enum/flight.enum";

export class SeatAvailabilityDto{

    @IsNotEmpty()
    id:string

    @IsNotEmpty()
    @IsEnum(SeatClassEnum)
    seatClass: SeatClassEnum

    @IsNotEmpty()
    @IsInt()
    newCount: number
}