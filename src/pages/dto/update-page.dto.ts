import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdatePageDto {
		@IsOptional()
    title_en: string;
    @IsOptional()
    title_ar: string;

    @IsOptional()
    slug: string;
    @IsOptional()
    content: string;
}