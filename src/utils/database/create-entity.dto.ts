import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class AbstractCreateEntityDto {
    @IsUUID("4", { message: 'Invalid UUID format.' })
    @IsOptional()
    id?: string | null;
    
    @IsString()
    @IsOptional()
    createdBy?: string | null;

    @IsString()
    @IsOptional()
    updatedBy?: string | null;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean | null;
}
