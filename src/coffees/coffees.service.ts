import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCoffeeDtoDto } from './dto/create-coffee-dto.dto';
import { UpdateCoffeeDtoDto } from './dto/update-coffee-dto.dto';
import { Coffee, COFFEE_LIMIT, COFFEE_OFFSET } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  readonly FIND_OPTIONS: FindManyOptions<Coffee> = {
    relations: ['flavors'],
  };

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepo: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepo: Repository<Flavor>,
  ) {}

  findAll(): Promise<Coffee[]> {
    return this.coffeeRepo.find(this.FIND_OPTIONS);
  }

  async findPaginatedAll(
    queryPagination: PaginationQueryDto,
  ): Promise<Coffee[]> {
    let { limit, offset } = queryPagination;
    return await this.coffeeRepo.find({
      ...this.FIND_OPTIONS,
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepo.findOne(id, this.FIND_OPTIONS);
    if (!coffee) throw new NotFoundException(`Coffee #${id} non trouvé !`);
    return coffee;
  }

  async create(coffee: CreateCoffeeDtoDto): Promise<Coffee> {
    const flavors = await Promise.all(
      coffee.flavors.map((flavor) => this.preLoadFlavorByName(flavor)),
    );

    const coffeeCreated: Coffee = this.coffeeRepo.create({
      ...coffee,
      flavors,
    });
    return this.coffeeRepo.save(coffeeCreated);
  }

  async update(id: string, newCoffee: UpdateCoffeeDtoDto): Promise<Coffee> {
    const flavors =
      newCoffee.flavors &&
      (await Promise.all(
        newCoffee.flavors.map((flavor) => this.preLoadFlavorByName(flavor)),
      ));
    const coffee = await this.coffeeRepo.preload({
      id: +id,
      ...newCoffee,
      flavors,
    });
    if (!coffee) throw new NotFoundException(`Coffee #${id} non trouvé !`);
    return this.coffeeRepo.save(coffee);
  }

  async remove(id: string): Promise<Coffee> {
    return this.coffeeRepo.remove(await this.findOne(id));
  }

  private async preLoadFlavorByName(name: string): Promise<Flavor> {
    const existedFlavor: Flavor = await this.flavorRepo.findOne({ name });
    return existedFlavor ? existedFlavor : this.flavorRepo.create({ name });
  }
}
