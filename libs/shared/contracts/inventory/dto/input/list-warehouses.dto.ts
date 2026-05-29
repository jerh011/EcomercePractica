export class ListWarehousesQueryDto {
  pageSize?: number;
  page?: number;
  query?: string;
  createdAt?: string;
  stateId?: string;
  municipalityId?: string;
  isActive?: boolean;
}
