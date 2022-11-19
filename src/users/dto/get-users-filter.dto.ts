import { Roles } from './../../auth/roles.enum';
import { IsEnum,  IsOptional } from "class-validator";


export class GetUsersFilterDto {
    @IsOptional()
		@IsEnum(Roles)
 		role: Roles;
}