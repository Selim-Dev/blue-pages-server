import { IsNotEmpty, IsOptional } from "class-validator";


export class VideoDto {
    
    @IsNotEmpty()
    video: string;

    @IsNotEmpty()
    companyId: number;


}