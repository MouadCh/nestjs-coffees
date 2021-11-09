import {
  Body,
  Controller,
  Param,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDtoDto } from './dto/create-coffee-dto.dto';
import { UpdateCoffeeDtoDto } from './dto/update-coffee-dto.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}
  @Get()
  findAllFlavors(@Query() queryPagination: PaginationQueryDto) {
    return this.coffeeService.findPaginatedAll(queryPagination);
  }
  @Get(':id')
  getOneCoffee(@Param('id') id: string) {
    return this.coffeeService.findOne(id);
  }
  @Post()
  createOne(@Body() createCoffeeDtoDto: CreateCoffeeDtoDto) {
    return this.coffeeService.create(createCoffeeDtoDto);
  }
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoffeeDtoDto: UpdateCoffeeDtoDto,
  ) {
    return this.coffeeService.update(id, updateCoffeeDtoDto);
  }
}
