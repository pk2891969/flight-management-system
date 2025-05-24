import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { SeatClassEnum } from "src/flight/enum/flight.enum";

export class UpdateFareDto{

    @IsEnum(SeatClassEnum)
    seatClass: SeatClassEnum

    @IsNumber()
    @Min(0)
    fare: number;

    
}