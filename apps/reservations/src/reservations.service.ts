import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { User } from '@app/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createReservationDto: CreateReservationDto, { email, id: userId }: User) {
    return this.prismaService.reservation.create({
      data: {
        startDate: createReservationDto.startDate,
        endDate: createReservationDto.endDate,
        invoiceId: "12354",
        userId,
        timestamp: new Date(),
      }
    });
  }

  async findAll() {
    return this.prismaService.reservation.findMany({});
  }

  async findOne(id: string) {
    return this.prismaService.reservation.findUniqueOrThrow({ where: { id } })
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto
    })
  }

  async remove(id: string) {
    return this.prismaService.reservation.delete({ where: { id } })
  }
}
