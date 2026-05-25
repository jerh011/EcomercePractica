// import { Test, TestingModule } from '@nestjs/testing';
// import { CompositeController } from './composite.controller';
// import { CompositeService } from './composite.service';

// describe('CompositeController', () => {
//   let controller: CompositeController;
//   let compositeService: {
//     getCategoriesPage: jest.Mock;
//     getCategoryChildrenPage: jest.Mock;
//     getBrandsPage: jest.Mock;
//     getWarehousesPage: jest.Mock;
//     getAttributesPage: jest.Mock;
//     getAttributesCreateDialog: jest.Mock;
//   };

//   const category = {
//     id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
//     name: 'Category',
//     slug: 'category',
//     isActive: true,
//     visibleInMenu: true,
//     parentId: '018f4dc4-5f51-7c55-9b8f-15fbdd99b102',
//     parentName: 'Parent',
//     description: 'text',
//     metaTitle: 'Meta title',
//     metaDescription: 'Meta description',
//     createdAt: new Date('2026-04-13T00:00:00.000Z'),
//     updatedAt: new Date('2026-04-13T00:00:00.000Z'),
//   };

//   beforeEach(async () => {
//     compositeService = {
//       getCategoriesPage: jest.fn(),
//       getCategoryChildrenPage: jest.fn(),
//       getBrandsPage: jest.fn(),
//       getWarehousesPage: jest.fn(),
//       getAttributesPage: jest.fn(),
//       getAttributesCreateDialog: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CompositeController],
//       providers: [
//         {
//           provide: CompositeService,
//           useValue: compositeService,
//         },
//       ],
//     }).compile();

//     controller = module.get(CompositeController);
//   });

//   it('returns raw categories page data', async () => {
//     compositeService.getCategoriesPage.mockResolvedValue({
//       table: {
//         categories: [category],
//         totalCount: 1,
//         totalPages: 1,
//       },
//     });

//     const result = await controller.getCategoriesPage({ page: '1' });

//     expect(result).toEqual({
//       table: {
//         categories: [category],
//         totalCount: 1,
//         totalPages: 1,
//       },
//     });
//   });

//   it('returns raw category children page data', async () => {
//     compositeService.getCategoryChildrenPage.mockResolvedValue({
//       category: {
//         ...category,
//         children: [],
//       },
//     });

//     const result = await controller.getCategoryChildrenPage({
//       id: category.id,
//     });

//     expect(compositeService.getCategoryChildrenPage).toHaveBeenCalledWith(
//       category.id,
//     );
//     expect(result).toEqual({
//       category: {
//         ...category,
//         children: [],
//       },
//     });
//   });

//   it('returns raw brands page data', async () => {
//     compositeService.getBrandsPage.mockResolvedValue({
//       table: {
//         brands: [{ id: category.id, name: 'Brand' }],
//         totalCount: 1,
//         totalPages: 1,
//       },
//     });

//     const result = await controller.getBrandsPage({ page: '1' });

//     expect(result).toEqual({
//       table: {
//         brands: [{ id: category.id, name: 'Brand' }],
//         totalCount: 1,
//         totalPages: 1,
//       },
//     });
//   });

//   it('returns raw warehouses page data', async () => {
//     compositeService.getWarehousesPage.mockResolvedValue({
//       table: {
//         warehouses: [{ id: category.id, name: 'Main Warehouse', code: 'HMO-MAIN' }],
//         totalCount: 1,
//         totalPages: 1,
//       },
//       filters: {
//         states: [{ id: 'state-id', code: '26', name: 'Sonora' }],
//       },
//     });

//     const result = await controller.getWarehousesPage({ page: '1' });

//     expect(result).toEqual({
//       table: {
//         warehouses: [{ id: category.id, name: 'Main Warehouse', code: 'HMO-MAIN' }],
//         totalCount: 1,
//         totalPages: 1,
//       },
//       filters: {
//         states: [{ id: 'state-id', code: '26', name: 'Sonora' }],
//       },
//     });
//   });

//   it('returns raw attributes page data', async () => {
//     compositeService.getAttributesPage.mockResolvedValue({
//       table: {
//         attributes: [],
//         totalCount: 0,
//         totalPages: 0,
//       },
//     });

//     const result = await controller.getAttributesPage({});

//     expect(result).toEqual({
//       table: {
//         attributes: [],
//         totalCount: 0,
//         totalPages: 0,
//       },
//     });
//   });

//   it('returns raw attributes create dialog category options', async () => {
//     compositeService.getAttributesCreateDialog.mockResolvedValue({
//       categories: [{ id: category.id, name: 'Category', slug: 'category' }],
//     });

//     const result = await controller.getAttributesCreateDialog({});

//     expect(result).toEqual({
//       categories: [{ id: category.id, name: 'Category', slug: 'category' }],
//     });
//   });
// });
