import { Injectable } from '@nestjs/common';
import { CreateRecordOfIlnessDto } from './dto/create-record_of_ilness.dto';
import { UpdateRecordOfIlnessDto } from './dto/update-record_of_ilness.dto';

@Injectable()
export class RecordOfIlnessService {
  create(createRecordOfIlnessDto: CreateRecordOfIlnessDto) {
    return 'This action adds a new recordOfIlness';
  }

  findAll() {
    return `This action returns all recordOfIlness`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordOfIlness`;
  }

  update(id: number, updateRecordOfIlnessDto: UpdateRecordOfIlnessDto) {
    return `This action updates a #${id} recordOfIlness`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordOfIlness`;
  }
}
