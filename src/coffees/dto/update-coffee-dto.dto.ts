import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDtoDto } from './create-coffee-dto.dto';

export class UpdateCoffeeDtoDto extends PartialType(CreateCoffeeDtoDto) {}
