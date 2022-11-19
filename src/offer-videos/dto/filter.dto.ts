import { IsOptional } from "class-validator";


export class FilterOfferVideoDto {
    @IsOptional()
    offerId: number;

}