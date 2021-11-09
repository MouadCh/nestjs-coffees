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
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDtoDto } from './dto/create-coffee-dto.dto';

import { UpdateCoffeeDtoDto } from './dto/update-coffee-dto.dto';
import { Coffee } from './entities/coffee.entity';
import { ApiTags } from "@nestjs/swagger";

@Controller('coffees')
@ApiTags('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Public()
  @Get()
  async findAllFlavors(
    @Protocol() protocol: string,
    @Query() queryPagination: PaginationQueryDto,
  ): Promise<Coffee[]> {
    console.log(
      '🚀 ~ file: coffees.controller.ts ~ line 32 ~ CoffeesController ~ protocol',
      protocol,
    );
    return this.coffeeService.findPaginatedAll(queryPagination);
  }
  @Get(':id')
  getOneCoffee(@Param('id', ParseIntPipe) id: string): Promise<Coffee> {
    return this.coffeeService.findOne(id);
  }
  @Post()
  createOne(@Body() createCoffeeDtoDto: CreateCoffeeDtoDto) {
    return this.coffeeService.create(createCoffeeDtoDto);
  }
  @Delete(':id')
  deleteOne(@Param('id') id) {
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
