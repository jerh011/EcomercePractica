import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { StoreSettingsService } from './store-settings.service';
import {
  validateListMunicipalitiesQuery,
  validateUpsertContactStoreSettingsBody,
  validateUpsertFiscalStoreSettingsBody,
  validateUpsertGeneralStoreSettingsBody,
  validateUpsertIdentityStoreSettingsBody,
} from './validations/store-settings.validation';
import { SuccessResponse } from '../common/interceptors/success-response.decorator';

@ApiTags('Store Settings')
@ApiBearerAuth()
@UseFilters(LegacyHttpExceptionFilter)
@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @SuccessResponse('Store general settings retrieved successfully')
  @Get('general')
  async getGeneralSettings() {
    return this.storeSettingsService.getGeneralSettings();
  }

  @SuccessResponse('Store general settings saved successfully')
  @Patch('general')
  async upsertGeneralSettings(@Body() body: unknown) {
    const input = validateUpsertGeneralStoreSettingsBody(body);
    return this.storeSettingsService.upsertGeneralSettings(input);
  }

  @SuccessResponse('Store identity settings retrieved successfully')
  @Get('identity')
  async getIdentitySettings() {
    return this.storeSettingsService.getIdentitySettings();
  }

  @SuccessResponse('Store identity settings saved successfully')
  @Patch('identity')
  async upsertIdentitySettings(@Body() body: unknown) {
    const input = validateUpsertIdentityStoreSettingsBody(body);
    return this.storeSettingsService.upsertIdentitySettings(input);
  }

  @SuccessResponse('Store contact settings retrieved successfully')
  @Get('contact')
  async getContactSettings() {
    return this.storeSettingsService.getContactSettings();
  }

  @SuccessResponse('Store contact settings saved successfully')
  @Patch('contact')
  async upsertContactSettings(@Body() body: unknown) {
    const input = validateUpsertContactStoreSettingsBody(body);
    return this.storeSettingsService.upsertContactSettings(input);
  }

  @SuccessResponse('Store fiscal settings retrieved successfully')
  @Get('fiscal')
  async getFiscalSettings() {
    return this.storeSettingsService.getFiscalSettings();
  }

  @SuccessResponse('Store fiscal settings saved successfully')
  @Patch('fiscal')
  async upsertFiscalSettings(@Body() body: unknown) {
    const input = validateUpsertFiscalStoreSettingsBody(body);
    return this.storeSettingsService.upsertFiscalSettings(input);
  }

  @SuccessResponse('Mexico states retrieved successfully')
  @Get('mexico-states')
  async listMexicoStates() {
    return this.storeSettingsService.listMexicoStates();
  }

  @SuccessResponse('Mexico municipalities retrieved successfully')
  @Get('mexico-municipalities')
  async listMexicoMunicipalities(@Query() query: unknown) {
    const input = validateListMunicipalitiesQuery(query);
    return this.storeSettingsService.listMexicoMunicipalities(input.stateId);
  }

  @SuccessResponse('Tax regimes retrieved successfully')
  @Get('tax-regimes')
  async listTaxRegimes() {
    return this.storeSettingsService.listTaxRegimes();
  }
}
