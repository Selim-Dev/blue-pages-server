import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdateVideoDto {

    @IsOptional()
    video: string;

    @IsOptional()
    companyId: number;
}