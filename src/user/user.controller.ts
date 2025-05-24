import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ){}

    @Post('sign-up')
    signUp(@Body() signupDto:SignUpDto){
        return this.userService.signUp(signupDto)

    }

    @Post('sign-in')
    signIn(@Body() signInDto: SignInDto){
        return this.userService.signIn(signInDto)
    }

    @Get('all-users')
    getAllUsers(){
        return this.userService.getAllUsers()

    }

    
}
