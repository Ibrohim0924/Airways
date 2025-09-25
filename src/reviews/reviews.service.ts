import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { Flight } from 'src/flights/entities/flight.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Flight) private flightRepository: Repository<Flight>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }
  async create(createReviewDto: CreateReviewDto) {
    const user = await this.userRepository.findOne({ where: { id: createReviewDto.userId } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    const flight = await this.flightRepository.findOne({ where: { id: createReviewDto.flightId } });
    if (!flight) {
      throw new NotFoundException('Reys topilmadi');
    }

    const newReview = this.reviewRepository.create({
      user,
      flight,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment
    });
    await this.reviewRepository.save(newReview)
    return { message: "Fikr-mulohaza qoldirildi", review: newReview };
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({ relations: ['user', 'flight'] });
    return { message: "Fikr-mulohazalar ro'yxati", review: reviews}
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['user', 'flight'] });
    if (!review) {
      throw new NotFoundException('Fikr-mulohaza topilmadi');
    }
    return { message: "Fikr-mulohaza topildi", review };
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['user', 'flight'] });
    if (!review) {
      throw new NotFoundException('Fikr-mulohaza topilmadi');
    }
    if(updateReviewDto.userId && updateReviewDto.userId !== review.user.id){
      const user = await this.userRepository.findOne({ where: { id: updateReviewDto.userId } });
      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      review.user = user;
    }
    if(updateReviewDto.flightId && updateReviewDto.flightId !== review.flight.id){
      const flight = await this.flightRepository.findOne({ where: { id: updateReviewDto.flightId } });
      if (!flight) {
        throw new NotFoundException('Reys topilmadi');
      }
      review.flight = flight;
    }

    if(updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }

    if(updateReviewDto.comment) {
      review.comment = updateReviewDto.comment;
    }
    await this.reviewRepository.save(review);
    return { message: "Fikr-mulohaza yangilandi", review };
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Fikr-mulohaza topilmadi');
    }
    await this.reviewRepository.remove(review);
    return { message: "Fikr-mulohaza o'chirildi" };
  }
}
