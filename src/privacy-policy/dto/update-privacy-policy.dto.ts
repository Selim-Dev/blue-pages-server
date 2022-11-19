import { IsOptional } from "class-validator";

export class UpdatePrivacyPolicyDto {
    @IsOptional()
    page: string;

    @IsOptional()
    slug: string;

    @IsOptional()
    title: string;

    @IsOptional()
    content: string;
    
}