import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';
import { ApiProperty } from '@nestjs/swagger';

export const COFFEE_LIMIT: number = 10;
export const COFFEE_OFFSET: number = 0;

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of a coffee.' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The brand of a coffee.' })
  @Column()
  brand: string;

  @ApiProperty({ example: ['chocolate','vanille'] })
  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, { cascade: true })
  flavors: Flavor[];
}
function AipProperty() {
  throw new Error('Function not implemented.');
}

function desc(desc: any) {
  throw new Error('Function not implemented.');
}
