import { IsOptional } from "class-validator";


export class FilterPlanDto {
    
    @IsOptional()
    planId: number;

}