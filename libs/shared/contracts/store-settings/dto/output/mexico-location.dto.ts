export class MexicoStateDto {
  id!: string;
  code!: string;
  name!: string;
}

export class MexicoMunicipalityDto {
  id!: string;
  stateId!: string;
  code?: string;
  name!: string;
}
