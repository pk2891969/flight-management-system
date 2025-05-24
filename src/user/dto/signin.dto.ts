import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
        
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
