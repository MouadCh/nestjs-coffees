import { PartialType } from '@nestjs/swagger';
import { CreateCoffeeDtoDto } from './create-coffee-dto.dto';

export class UpdateCoffeeDtoDto extends PartialType(CreateCoffeeDtoDto) {}
