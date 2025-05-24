import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { SeatClassEnum } from "../enum/flight.enum";

export class SeatAvailabilityDto{

    @IsNotEmpty()
    @IsEnum(SeatClassEnum)
    seatClass: SeatClassEnum

    @IsNotEmpty()
    @IsInt()
    totalSeats: number

    @IsOptional()
    availableSeats:string[]

    @IsOptional()
    bookedSeats: string[]
}