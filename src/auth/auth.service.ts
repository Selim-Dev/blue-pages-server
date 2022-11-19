import { Country } from './../countries/country.entity';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs'
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserInterface } from './interfaces/register.interface';
import { User } from './models/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginUserInterface } from './interfaces/login.interface';
import { logger } from 'handlebars';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
		private jwtService: JwtService,

	) { }

	// hash password
	hashedPassword(password: any): Observable<any> {
		return from(bcrypt.hash(password, 10))
	}

	// update the user password
	updatee(id: number, body: any) {
		return this.userRepository.update(id, body);
	}

	// registration account function 
	async registrationAccount(user: RegisterDto): Promise<any> {

		const { name, email, password, confirmPassword } = user;
		if (password !== confirmPassword) {
			throw new BadRequestException('your Passwords do not match');
		}
		// hash the password
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const createdUser = this.userRepository.create({
			name, email,
			password: hashedPassword,
		});
		try {
			await this.userRepository.save(createdUser);
			return { statusCode: 200 }
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
		// return this.hashedPassword(password).pipe(
		//     switchMap((hashpassword: string) => {
		//         return from(this.userRepository.save({  name, email, password: hashpassword })).pipe(
		//             map((user: LoginUserInterface) => {
		//                 delete user.password;
		//                 return user;
		//             })
		//         )
		//     })
		// )
	}

	// validate user login
	validateUser(email: string, password: string): any {
		// console.log(bcrypt.compare(password, '328179348267'))
		console.log({email,password})
		return from(this.findUserByEmail({ email })).pipe(
			switchMap((user: LoginUserInterface) =>
				from(bcrypt.compare(password, user.password)).pipe(
					map((isValidPassword: boolean) => {
						if (isValidPassword) {
							delete user.password;
							return user;
						} else {
							throw new NotFoundException('Invalid your email or password');
						}
					})
				)
			)
		)
	}
	// Login user and create token 
	login(user: LoginDto): any {
		console.log(process.env.TEST)
		// console.log(bcrypt)
		// const hash = bcrypt.hash('my password', 10); 
		// bcrypt.compare('my password', "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", (err, res) => { 
		// 	if(err) console.log({err})
		// 	console.log({res})
		// 	// res == true or res == false 
		// });
		const { email, password } = user;
		return this.validateUser(email, password).pipe(
			switchMap((user: UserInterface) => {
				if (user) {
					// create JWT - credentials
					return from(this.jwtService.signAsync({ user:{ id:user.id ,role:user.role,email:user.email} }))
				} else {
					throw new NotFoundException('Invalid rour email or password');
				}
			})
		)
	}
	// function to get user by email for forgot password
	async findByEmail(body: object): Promise<any> {
		const user = await this.userRepository.findOne(body, { select: ['id', 'name', 'email', 'password', 'createdAt'] });
		if (!user) {
			throw new NotFoundException('Invalid your email !!!!');
		}
		return user;
	}
	// function to get user by email for login
	async findUserByEmail(body: object): Promise<any> {
		const user = await this.userRepository.findOne(body);
		if (!user) {
			throw new NotFoundException('Invalid your email or password');
		}
		return user
	}


	// find user by id
	async findUserById(body: any) {
		const user = await this.userRepository.findOne(body, { select: ['id', 'name', 'email', 'createdAt'] });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

}
