import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/common/interfaces';
import { v4 as uuid } from 'uuid';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class UserService {
    private users:User[] = []

    signUp(signUpdDto: SignUpDto) {
        try {
            let { name, email, password } = signUpdDto

            if (this.users.find(user => user.email === email)) {
                throw new BadRequestException('User already exist!');
            }

            const user = { id: uuid(), name, email, password };
            this.users.push(user);
            return { id: user.id, name: user.name, email: user.email };

        } catch (e) {
            throw new InternalServerErrorException(e)

        }


    }

    getAllUsers(){
        return this.users
    }

    signIn(signInDto: SignInDto){
        try{
            const { email, password } = signInDto
            const user = this.users.find(u => u.email === email && u.password === password);
            if (!user) {
                throw new NotFoundException('Invalid credentials');
            }
            return { userId: user.id };
            
        }catch(e){
            throw new InternalServerErrorException(e)

        }
        
    }

    getUserById(userId:string){
        return this.users.find(user => user.id === userId);
    }
}
