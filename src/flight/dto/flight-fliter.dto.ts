import { IsEnum, IsOptional, IsString } from "class-validator";
import { FlightStatusEnum } from "../enum/flight.enum";

export class FlightFilterDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsEnum(FlightStatusEnum)
  status?: FlightStatusEnum;
}