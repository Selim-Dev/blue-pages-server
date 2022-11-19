import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class ProtectMiddleware implements NestMiddleware {
	constructor(private readonly roles:string[]){
		this.roles = roles;
	}

  use(req: Request, res: Response, next: NextFunction) {
		if (!this.roles.includes(req?.user['role'])) {
			//( req.user).role> came from the above function(middle ware protect)
			throw new UnauthorizedException();
	}
    next();
  }
}
