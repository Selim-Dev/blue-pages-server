import { IsNotEmpty } from "class-validator";

export class PrivacyPolicyDto {
    @IsNotEmpty()
    page: string;

    @IsNotEmpty()
    slug: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;
    
}