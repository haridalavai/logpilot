import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsObject } from "class-validator";
import { InjestPayload } from "@logpilot/common";

export class IngestEventDto implements InjestPayload {
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  environment?: string;

  @IsString()
  @IsOptional()
  stacktrace?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
  
  @IsObject()
  @IsOptional()
  user?: Record<any, any>;

  @IsObject()
  @IsOptional()
  extra?: Record<any, any>;

  @IsObject()
  @IsOptional()
  device?: Record<any, any>;

  @IsArray()
  @IsOptional()
  
  breadcrumbs?: Record<any, any>[];
}
    