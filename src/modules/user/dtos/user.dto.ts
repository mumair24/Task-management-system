import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";
import { AbstractCreateEntityDto } from "src/utils/database/create-entity.dto";
import { getUserRoles } from "../utils/user.roles";

export class UserDto extends AbstractCreateEntityDto {
    @IsString()
    @ApiProperty({ type: String, description: 'Name to be displayed, of the user.' })
    displayName: string;

    @IsString()
    @ApiProperty({ type: String, description: 'First name of the user.' })
    firstName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, description: 'Middle name of the user.' })
    middleName?: string | null;

    @IsString()
    @ApiProperty({ type: String, description: 'Last name of the user.' })
    lastName: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    @ApiProperty({ type: String, description: 'Email address of the user.' })
    email: string;

    @IsEnum(getUserRoles, { message: 'Invalid role has been selected for User.' })
    @ApiProperty({ type: String, description: 'Role of the user.', enum: getUserRoles })
    role: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ type: Date, description: 'Date of birth of the user.', format: 'date-time', required: false })
    dob?: Date | null;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ type: String, description: 'URL for Display picture of the user.', required: false })
    displayPicture?: string | null;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, description: 'Phone number of the user.' })
    phoneNumber?: string | null;
}