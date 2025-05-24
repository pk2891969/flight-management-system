import { IsNumber, Min } from 'class-validator';

export class SetFareDto {
  @IsNumber()
  @Min(0)
  economy: number;

  @IsNumber()
  @Min(0)
  business: number;

  @IsNumber()
  @Min(0)
  first: number;
}
