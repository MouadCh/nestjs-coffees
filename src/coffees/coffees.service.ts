import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDtoDto } from './dto/create-coffee-dto.dto';
import { Coffee, COFFEE_LIMIT, COFFEE_OFFSET } from './models/coffee.model';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findPaginatedAll(queryPagination) {
    let { limit, offset } = queryPagination;
    limit = limit ? limit : COFFEE_LIMIT;
    offset = offset ? offset : COFFEE_OFFSET;
    let paginatedCoffees = this.coffees.slice(
      limit * offset,
      limit * (offset + 1),
    );
    return paginatedCoffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((coffee: Coffee) => coffee.id == +id);
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    return coffee;
  }

  create(coffee) {
    this.coffees.push(coffee);
  }

  update(id: string, newCoffee) {
    const existingCoffee: Coffee = this.findOne(id);
    if (existingCoffee) {
      // update the existing entity
    }
  }

  remove(id: string) {
    const existedCoffeeIndex: number = this.coffees.findIndex(
      (coffee) => coffee.id === +id,
    );
    if (existedCoffeeIndex >= 0) {
      this.coffees.splice(existedCoffeeIndex, 1);
    }
  }
}
