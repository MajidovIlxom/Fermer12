import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { MeatProductionModule } from './meat_production/meat_production.module';
import { FiberProductionModule } from './fiber_production/fiber_production.module';
import { MilkProductionModule } from './milk_production/milk_production.module';
import { RecordOfIlnessModule } from './record_of_ilness/record_of_ilness.module';

@Module({
  imports: [
  ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}),
  MongooseModule.forRoot(process.env.MONGODB_URL),
  AdminModule,
  MeatProductionModule,
  FiberProductionModule,
  MilkProductionModule,
  RecordOfIlnessModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
