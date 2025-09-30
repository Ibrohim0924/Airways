import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards 
} from '@nestjs/common';
import { LoyaltyprogramService } from './loyaltyprogram.service';
import { CreateLoyaltyprogramDto } from './dto/create-loyaltyprogram.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyaltyprogram.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('loyaltyprogram')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class LoyaltyprogramController {
  constructor(private readonly loyaltyprogramService: LoyaltyprogramService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() createLoyaltyprogramDto: CreateLoyaltyprogramDto) {
    return this.loyaltyprogramService.create(createLoyaltyprogramDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.loyaltyprogramService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.loyaltyprogramService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateLoyaltyprogramDto: UpdateLoyaltyProgramDto) {
    return this.loyaltyprogramService.update(+id, updateLoyaltyprogramDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.loyaltyprogramService.remove(+id);
  }
}
