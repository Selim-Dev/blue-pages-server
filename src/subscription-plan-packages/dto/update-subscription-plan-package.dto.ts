import {  IsNumber, IsOptional } from "class-validator";


export class UpdateSubscriptionPlanPackageDto {
    @IsOptional()
    title_en: string;
    @IsOptional()
    title_ar: string;
    @IsOptional()
    duration:number;
    @IsOptional()
    price:number;

}