export class CreateWarehouseDto {
  name!: string;
  code!: string;
  direction!: string;
  stateId!: string;
  municipalityId!: string;
  postalCode!: string;
  neighborhood!: string;
  street!: string;
  streetNumber!: string;
  reference?: string;
  isActive!: boolean;
}
