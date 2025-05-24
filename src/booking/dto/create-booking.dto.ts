import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { SeatClassEnum } from "src/flight/enum/flight.enum";

export class CreateBookingDto {
    @IsNotEmpty()
    @IsString()
    flightId: string;

    @IsNotEmpty()
    @IsEnum(SeatClassEnum)
    seatClass: SeatClassEnum

    @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true }) 
  seatNumbers: string[];

    @IsNotEmpty()
    @IsString()
    userId: string;
}
