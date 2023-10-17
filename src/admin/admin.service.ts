import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './Schemas/admin.schemma';
import { Model } from "mongoose"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  private readonly jwtService: JwtService
  ){}


  async getToken(admin: AdminDocument) {
    const jwtPayload = {
      id: admin._id,
      is_active: admin.is_active,
      is_created: admin.is_creator,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(createAdminDto: CreateAdminDto) {
    const { password, confirmPassword } = createAdminDto;
    if (password !== confirmPassword) {
      return new BadRequestException(' passwords is not match')
    }
    const hashed_password = await bcrypt.hash(password, 7)


    const cretedAdmin =await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.getToken(cretedAdmin );
    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      cretedAdmin._id,
      {hashed_token},
      {new: true},
    )
    return {updatedAdmin, tokens}
  }

  async findAll() {
    const admins = await this.adminModel.find()
    return admins
  }

  findOne(id: string) {
    return this.adminModel.findById(id).exec() 
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const existingAdmin = await this.adminModel
      .findByIdAndUpdate(id, updateAdminDto,{new: true})
    .exec()
    if (!existingAdmin){
      throw new NotFoundException(`Admin #${id} not found`)
    }
    return existingAdmin;
  }

  remove(id: string) {
    return this.adminModel.findByIdAndDelete(id);
  }
}
