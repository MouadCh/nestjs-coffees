import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { CreateCoffeeDtoDto } from './dto/create-coffee-dto.dto';
import { UpdateCoffeeDtoDto } from './dto/update-coffee-dto.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  findAll() {
    return this.coffeeModel.find().exec();
  }

  findPaginatedAll(queryPagination: PaginationQueryDto) {
    const { limit, offset } = queryPagination;
    return this.coffeeModel.find().limit(limit).skip(offset).exec();
  }

  async findOne(id: string) {
    try {
      const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
      if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
      return coffee;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  create(coffee: CreateCoffeeDtoDto) {
    const newCoffee = new this.coffeeModel(coffee);
    return newCoffee.save();
  }

  async update(id: string, newCoffee: UpdateCoffeeDtoDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: newCoffee }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
