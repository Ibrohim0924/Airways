import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoyaltyprogramDto } from './dto/create-loyaltyprogram.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyaltyprogram.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Loyaltyprogram, LoyaltyTier } from './entities/loyaltyprogram.entity';

@Injectable()
export class LoyaltyprogramService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Loyaltyprogram)
    private readonly loyaltyRepo: Repository<Loyaltyprogram>
  ) { }

  async create(createLoyaltyprogramDto: CreateLoyaltyprogramDto) {
    const user = await this.userRepo.findOne({ where: { id: createLoyaltyprogramDto.user_id } })
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi')
    }
    let loyalty = await this.loyaltyRepo.findOne({ where: { user: { id: createLoyaltyprogramDto.user_id } } })
    if (loyalty) {
      return loyalty
    }

    loyalty = this.loyaltyRepo.create({ user, points: 0, tier: LoyaltyTier.BRONZE })
    return this.loyaltyRepo.save(loyalty)
  }

  async findAll() {
    const loyalty = await this.loyaltyRepo.find({ relations: ['user'] })
    return loyalty
  }

  async findOne(id: number) {
    const loyalty = await this.loyaltyRepo.findOne({ where: { id }, relations: ['user'] })
    if (!loyalty) {
      throw new NotFoundException('Sodiqlik dasturi topilmadi')
    }
    return loyalty
  }

  async update(id: number, updateLoyaltyprogramDto: UpdateLoyaltyProgramDto) {
    const loyalty = await this.loyaltyRepo.findOne({ where: { id } });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty record with ID ${id} topilmadi`);
    }

    if (updateLoyaltyprogramDto.points !== undefined) {
      loyalty.points = updateLoyaltyprogramDto.points;
      loyalty.tier = this.calculateTier(updateLoyaltyprogramDto.points);
    }

    return this.loyaltyRepo.save(loyalty);
  }


  async remove(id: number) {
    const loyalty = await this.loyaltyRepo.findOne({ where: { id } })
    if (!loyalty) {
      throw new NotFoundException('Sodiqlik dasturi topilmadi')
    }
    await this.loyaltyRepo.delete(loyalty)
    return { message: "Sodiqlik dasturi muvaffaqiyatli o'chirildi" }
  }

  async addPoints(user: User) {
    let loyalty = await this.loyaltyRepo.findOne({ where: { user: { id: user.id } } });
    if (!loyalty) {
      loyalty = this.loyaltyRepo.create({ user, points: 0, tier: LoyaltyTier.BRONZE });
    }

    loyalty.points += 100
    loyalty.tier = this.calculateTier(loyalty.points);

    return this.loyaltyRepo.save(loyalty);
  }

  private calculateTier(points: number): LoyaltyTier {
    if (points >= 10000) return LoyaltyTier.PLATINUM;
    if (points >= 5000) return LoyaltyTier.GOLD;
    if (points >= 1000) return LoyaltyTier.SILVER;
    return LoyaltyTier.BRONZE;
  }
}
