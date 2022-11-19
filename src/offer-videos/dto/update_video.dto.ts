import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdateOfferVideoDto {

    @IsOptional()
    video: string;

    @IsOptional()
    offerId: number;
}