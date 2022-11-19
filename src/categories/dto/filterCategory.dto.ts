import { IsOptional } from "class-validator";


export class FilterCategoryDto {
    
    @IsOptional()
    status: boolean;

}