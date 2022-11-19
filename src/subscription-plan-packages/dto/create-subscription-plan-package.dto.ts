import { IsNotEmpty } from "class-validator";


export class CreateSubscriptionPlanPackageDto {
    @IsNotEmpty()
    title_en: string;
    @IsNotEmpty()
    title_ar: string;
    @IsNotEmpty()
    duration:number;
    @IsNotEmpty()
    price:number;
		@IsNotEmpty()
    subscriptionPlanId: number;
}