import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { FlightClassEnum } from "../enum/flight.enum";

export class SeatAvailabilityDto{

    @IsNotEmpty()
    id:string

    @IsNotEmpty()
    @IsEnum(FlightClassEnum)
    flightClass: FlightClassEnum

    @IsNotEmpty()
    @IsInt()
    newCount: number
}