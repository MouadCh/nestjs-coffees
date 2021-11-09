import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {  // Note "entity" was removed from the class "name"
  @Prop()
  type: string;

  @Prop()
  name: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);