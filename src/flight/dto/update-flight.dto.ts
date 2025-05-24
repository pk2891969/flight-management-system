import { IsOptional, IsString, IsInt, IsObject, ValidateNested, IsEnum } from 'class-validator';
import { FlightStatusEnum } from '../enum/flight.enum';
import { Type } from 'class-transformer';
import { SeatClassesDto } from './add-flight.dto';


export class UpdateFlightStatusDto {

    @IsOptional()
    @IsString()
    flightNo: string;

    @IsOptional()
    @IsString()
    from?: string;

    @IsOptional()
    @IsString()
    to?: string;

    @IsOptional()
    @IsString()
    date?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsEnum(FlightStatusEnum)
    status: FlightStatusEnum;

    @IsOptional()
    @ValidateNested()
    @Type(() => SeatClassesDto)
    seatClasses: SeatClassesDto;
}

