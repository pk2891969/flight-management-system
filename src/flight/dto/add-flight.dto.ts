import { IsString, IsDateString, IsEnum, IsObject, IsInt, Min, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FlightStatusEnum } from '../enum/flight.enum';

class SeatClassDto {
  @IsInt()
  @Min(0)
  totalSeats: number;

  @IsInt()
  @Min(0)
  bookedSeats: number;
}

export class SeatClassesDto { 
  @ValidateNested()
  @Type(() => SeatClassDto)
  economy: SeatClassDto;

  @ValidateNested()
  @Type(() => SeatClassDto)
  business: SeatClassDto;

  @ValidateNested()
  @Type(() => SeatClassDto)
  first: SeatClassDto;
}

export class AddFlightDto {

    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsDateString()
    date: string;

    @IsString()
    departureTime: string;

    @IsEnum(FlightStatusEnum)
    status: FlightStatusEnum

    @IsObject()
    @ValidateNested()
    @Type(() => SeatClassesDto)
    seatClasses: SeatClassesDto;
}
