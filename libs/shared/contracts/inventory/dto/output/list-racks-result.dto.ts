import type { RackDto } from './rack.dto.js';

export class ListRacksResultDto {
  racks!: RackDto[];
  totalCount!: number;
  totalPages!: number;
}
