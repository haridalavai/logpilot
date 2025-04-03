import { EventType } from "@prisma/client";
import { IsString, IsNotEmpty } from "class-validator";

export class IngestEventDto {
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  type: EventType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
    