import { IsNotEmpty, IsOptional } from "class-validator";


export class OfferVideoDto {
    @IsNotEmpty()
    video: string;

    @IsNotEmpty()
    offerId: number;
}