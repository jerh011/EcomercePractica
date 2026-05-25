jest.mock('./validations/store-settings.validation', () => ({
  validateListMunicipalitiesQuery: jest.fn(),
  validateUpsertContactStoreSettingsBody: jest.fn(),
  validateUpsertFiscalStoreSettingsBody: jest.fn(),
  validateUpsertGeneralStoreSettingsBody: jest.fn(),
  validateUpsertIdentityStoreSettingsBody: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { StoreSettingsController } from './store-settings.controller';
import { StoreSettingsService } from './store-settings.service';
import {
  validateListMunicipalitiesQuery,
  validateUpsertContactStoreSettingsBody,
  validateUpsertFiscalStoreSettingsBody,
  validateUpsertGeneralStoreSettingsBody,
  validateUpsertIdentityStoreSettingsBody,
} from './validations/store-settings.validation';
import { SUCCESS_RESPONSE_MESSAGE } from '../common/interceptors/success-response.decorator';

describe('StoreSettingsController', () => {
  let controller: StoreSettingsController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      getGeneralSettings: jest.fn(),
      upsertGeneralSettings: jest.fn(),
      getIdentitySettings: jest.fn(),
      upsertIdentitySettings: jest.fn(),
      getContactSettings: jest.fn(),
      upsertContactSettings: jest.fn(),
      getFiscalSettings: jest.fn(),
      upsertFiscalSettings: jest.fn(),
      listMexicoStates: jest.fn(),
      listMexicoMunicipalities: jest.fn(),
      listTaxRegimes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreSettingsController],
      providers: [
        {
          provide: StoreSettingsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get(StoreSettingsController);
    jest.clearAllMocks();
  });

  describe('General tab', () => {
    it('delegates general settings reads and keeps success metadata', async () => {
      const data = {
        id: 'settings-id',
        commercialName: 'Comercio MX',
        legalName: 'Comercio MX SA de CV',
      };
      service.getGeneralSettings.mockResolvedValue(data);

      await expect(controller.getGeneralSettings()).resolves.toEqual(data);
      expect(service.getGeneralSettings).toHaveBeenCalledTimes(1);
      expect(
        Reflect.getMetadata(
          SUCCESS_RESPONSE_MESSAGE,
          StoreSettingsController.prototype.getGeneralSettings,
        ),
      ).toBe('Store general settings retrieved successfully');
    });

    it('validates and saves general settings', async () => {
      const body = { commercialName: 'MA', legalName: 'MA SA' };
      const validated = { ...body, shortDescription: 'Short' };
      const saved = { id: 'settings-id', ...validated };

      (validateUpsertGeneralStoreSettingsBody as jest.Mock).mockReturnValue(
        validated,
      );
      service.upsertGeneralSettings.mockResolvedValue(saved);

      await expect(controller.upsertGeneralSettings(body)).resolves.toEqual(
        saved,
      );
      expect(validateUpsertGeneralStoreSettingsBody).toHaveBeenCalledWith(body);
      expect(service.upsertGeneralSettings).toHaveBeenCalledWith(validated);
    });
  });

  describe('Identity tab', () => {
    it('delegates identity settings reads', async () => {
      const data = {
        id: 'settings-id',
        primaryLogoUrl: 'https://example.com/logo.png',
        primaryColorHex: '#3B82F6',
        secondaryColorHex: '#1698B8',
        accentColorHex: '#F59E0B',
      };
      service.getIdentitySettings.mockResolvedValue(data);

      await expect(controller.getIdentitySettings()).resolves.toEqual(data);
      expect(service.getIdentitySettings).toHaveBeenCalledTimes(1);
    });

    it('validates and saves identity settings', async () => {
      const body = {
        primaryLogoUrl: 'https://example.com/logo.png',
        primaryColorHex: '#ffffff',
        secondaryColorHex: '#000000',
        accentColorHex: '#ff0000',
      };
      const saved = { id: 'settings-id', ...body };

      (validateUpsertIdentityStoreSettingsBody as jest.Mock).mockReturnValue(
        body,
      );
      service.upsertIdentitySettings.mockResolvedValue(saved);

      await expect(controller.upsertIdentitySettings(body)).resolves.toEqual(
        saved,
      );
      expect(validateUpsertIdentityStoreSettingsBody).toHaveBeenCalledWith(
        body,
      );
      expect(service.upsertIdentitySettings).toHaveBeenCalledWith(body);
    });
  });

  describe('Contact tab', () => {
    it('delegates contact settings reads', async () => {
      const data = { id: 'contact-id', contactEmail: 'hello@example.com' };
      service.getContactSettings.mockResolvedValue(data);

      await expect(controller.getContactSettings()).resolves.toEqual(data);
      expect(service.getContactSettings).toHaveBeenCalledTimes(1);
    });

    it('validates and saves contact settings', async () => {
      const body = { contactEmail: 'hello@example.com' };
      const saved = { id: 'settings-id', ...body };

      (validateUpsertContactStoreSettingsBody as jest.Mock).mockReturnValue(
        body,
      );
      service.upsertContactSettings.mockResolvedValue(saved);

      await expect(controller.upsertContactSettings(body)).resolves.toEqual(
        saved,
      );
      expect(validateUpsertContactStoreSettingsBody).toHaveBeenCalledWith(body);
      expect(service.upsertContactSettings).toHaveBeenCalledWith(body);
    });
  });

  describe('Fiscal tab', () => {
    it('delegates fiscal settings reads', async () => {
      const data = { id: 'fiscal-id', taxId: 'ABC010203AA1' };
      service.getFiscalSettings.mockResolvedValue(data);

      await expect(controller.getFiscalSettings()).resolves.toEqual(data);
      expect(service.getFiscalSettings).toHaveBeenCalledTimes(1);
    });

    it('validates and saves fiscal settings', async () => {
      const body = { taxId: 'ABC010203AA1' };
      const saved = { id: 'settings-id', ...body };

      (validateUpsertFiscalStoreSettingsBody as jest.Mock).mockReturnValue(
        body,
      );
      service.upsertFiscalSettings.mockResolvedValue(saved);

      await expect(controller.upsertFiscalSettings(body)).resolves.toEqual(
        saved,
      );
      expect(validateUpsertFiscalStoreSettingsBody).toHaveBeenCalledWith(body);
      expect(service.upsertFiscalSettings).toHaveBeenCalledWith(body);
    });
  });

  describe('Catalog routes', () => {
    it('delegates catalog reads to the service', async () => {
      service.listMexicoStates.mockResolvedValue([{ id: 'state-id' }]);
      service.listTaxRegimes.mockResolvedValue([{ code: '601' }]);

      await expect(controller.listMexicoStates()).resolves.toEqual([
        { id: 'state-id' },
      ]);
      await expect(controller.listTaxRegimes()).resolves.toEqual([
        { code: '601' },
      ]);
    });

    it('validates municipality filters before listing municipalities', async () => {
      const query = { stateId: 'state-id' };
      const validated = { stateId: 'state-id' };
      const municipalities = [{ id: 'municipality-id', name: 'Hermosillo' }];

      (validateListMunicipalitiesQuery as jest.Mock).mockReturnValue(validated);
      service.listMexicoMunicipalities.mockResolvedValue(municipalities);

      await expect(controller.listMexicoMunicipalities(query)).resolves.toEqual(
        municipalities,
      );
      expect(validateListMunicipalitiesQuery).toHaveBeenCalledWith(query);
      expect(service.listMexicoMunicipalities).toHaveBeenCalledWith('state-id');
    });
  });
});
