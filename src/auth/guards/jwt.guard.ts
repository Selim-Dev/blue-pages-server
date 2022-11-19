import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// use this guard to protect routes that require a valid JWT
@Injectable()
export class JwtGuard extends AuthGuard('jwt') { }
