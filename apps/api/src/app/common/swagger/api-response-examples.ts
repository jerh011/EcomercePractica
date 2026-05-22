import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

const categoryExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
  name: 'Running Shoes',
  slug: 'running-shoes',
  isActive: true,
  visibleInMenu: true,
  parent: {
    id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b100',
    name: 'Shoes',
    slug: 'shoes',
  },
  hasAttributes: true,
  parentId: '018f4dc4-5f51-7c55-9b8f-15fbdd99b100',
  parentName: 'Shoes',
  description: 'Performance footwear for daily training.',
  imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  metaTitle: 'Running Shoes',
  metaDescription: 'Shop running shoes for daily training.',
  createdAt: '2026-04-13T00:00:00.000Z',
  updatedAt: '2026-04-13T00:00:00.000Z',
};

const brandExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b201',
  name: 'Nike',
  visibleInMenu: true,
  slug: 'nike',
  logoUrl: 'https://example.test/nike-logo.png',
  description: 'Athletic footwear and apparel.',
  website: 'https://www.nike.com',
  metaTitle: 'Nike',
  metaDescription: 'Nike brand catalog.',
  isActive: true,
  createdAt: '2026-04-13T00:00:00.000Z',
  updatedAt: '2026-04-13T00:00:00.000Z',
};

const attributeExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b301',
  name: 'Color',
  slug: 'color',
  description: 'Available product color.',
  displayOrder: 1,
  isActive: true,
  isFilterable: true,
  isRequired: false,
  appliesToAll: false,
  categories: [
    {
      id: categoryExample.id,
      name: categoryExample.name,
      slug: categoryExample.slug,
    },
  ],
  createdAt: '2026-04-13T00:00:00.000Z',
  updatedAt: '2026-04-13T00:00:00.000Z',
};

const productExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b501',
  name: 'Pegasus 41',
  slug: 'pegasus-41',
  modelYear: '2026',
  descriptionHtml: '<p>Responsive everyday running shoe.</p>',
  descriptionShort: 'Responsive everyday running shoe.',
  specificationsHtml: '<ul><li>Foam midsole</li></ul>',
  basePrice: 149.99,
  isActive: true,
  isFeatured: false,
  dimensionsBase: {
    weight: '0.24 kg',
    length: '22 cm',
    width: '28 cm',
    height: '2 cm',
  },
  categories: [
    {
      id: categoryExample.id,
      name: categoryExample.name,
      slug: categoryExample.slug,
    },
  ],
  directAttributes: [
    {
      id: attributeExample.id,
      name: attributeExample.name,
      slug: attributeExample.slug,
    },
  ],
  attributes: [
    {
      id: attributeExample.id,
      name: attributeExample.name,
      slug: attributeExample.slug,
    },
  ],
  createdAt: '2026-04-13T00:00:00.000Z',
  updatedAt: '2026-04-13T00:00:00.000Z',
  variants: [
    {
      id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b502',
      sku: 'SKU-12346',
    },
  ],
  brand: {
    id: brandExample.id,
    name: brandExample.name,
    slug: brandExample.slug,
  },
};

const variantExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b601',
  product: {
    id: productExample.id,
    name: productExample.name,
    slug: productExample.slug,
  },
  sku: 'SKU-12345',
  price: '10.5',
  stockQuantity: 5,
  minimumStock: 1,
  barcodeGtin: '00012345600012',
  descriptionHtml: '<p>Description</p>',
  offerPrice: '9.99',
  offerStart: '2026-04-20T00:00:00.000Z',
  offerEnd: '2026-04-21T00:00:00.000Z',
  dimensions: {},
  isActive: true,
  imageUrls: [],
  directAttributes: [
    {
      id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b302',
      name: 'Size',
      slug: 'size',
    },
  ],
  attributes: [
    {
      id: attributeExample.id,
      name: attributeExample.name,
      slug: attributeExample.slug,
    },
    {
      id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b302',
      name: 'Size',
      slug: 'size',
    },
  ],
  attributeValues: [
    {
      attribute: {
        id: attributeExample.id,
        name: attributeExample.name,
        slug: attributeExample.slug,
      },
      value: 'Black',
    },
  ],
  createdAt: '2026-04-13T00:00:00.000Z',
  updatedAt: '2026-04-13T00:00:00.000Z',
};

const orderExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b701',
  userId: '018f4dc4-5f51-7c55-9b8f-15fbdd99b401',
  totalAmount: '399.98',
  shippingCost: '99.00',
  shippingAddressSnapshot: {
    street: 'Main St 123',
    city: 'Phoenix',
  },
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
  status: {
    id: 1,
    name: 'Pendiente',
    slug: 'pending',
  },
  items: [
    {
      id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b702',
      variantId: variantExample.id,
      quantity: 2,
      unitPrice: '199.99',
      productNameSnapshot: 'Pegasus 41',
      skuSnapshot: 'SKU-12345',
    },
  ],
};

const authUserExample = {
  id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b401',
  email: 'admin@example.test',
  name: 'Admin User',
  role: 'Administrador',
  profilePicture: 'https://example.test/profile.png',
};

const batchResultExample = {
  status: 'partial',
  succeeded: [{ key: 'tmp-1', id: categoryExample.id }],
  failed: [{ key: 'tmp-2', reason: 'slug already exists' }],
};

const syncChildrenResultExample = {
  status: 'success',
  created: {
    succeeded: [{ key: 'tmp-1', id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b102' }],
    failed: [],
  },
  updated: {
    succeeded: [{ id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b103' }],
    failed: [],
  },
  deleted: {
    succeeded: [{ id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b104' }],
    failed: [],
  },
};

function successEnvelope<T>(message: string, data: T) {
  return {
    success: true,
    message,
    data,
  };
}

function okExample(description: string, example: unknown) {
  return ApiOkResponse({
    description,
    content: {
      'application/json': {
        example,
      },
    },
  });
}

function createdExample(description: string, example: unknown) {
  return ApiCreatedResponse({
    description,
    content: {
      'application/json': {
        example,
      },
    },
  });
}

export const swaggerResponseExamples = {
  root: okExample('API welcome response.', { message: 'Hello API' }),
  usersList: okExample(
    'Users retrieved successfully.',
    successEnvelope('Users retrieved successfully', [
      {
        id: authUserExample.id,
        email: authUserExample.email,
        fullName: authUserExample.name,
        userType: 'STAFF',
        roles: [
          {
            id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b901',
            code: 'ADMIN',
            name: 'Administrador',
          },
        ],
        accessibleModules: [
          {
            id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b902',
            code: 'users',
            name: 'Usuarios',
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
          },
        ],
        isActive: true,
        disabledAt: null,
        createdAt: '2026-04-13T00:00:00.000Z',
      },
    ]),
  ),
  usersDisabled: okExample(
    'Staff user disabled successfully.',
    successEnvelope('Staff user disabled successfully', {
      id: authUserExample.id,
      email: authUserExample.email,
      fullName: authUserExample.name,
      userType: 'STAFF',
      userStatus: 'INACTIVE',
      roles: [
        {
          id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b901',
          code: 'ADMIN',
          name: 'Administrador',
        },
      ],
      accessibleModules: [],
      isActive: false,
      disabledAt: '2026-05-08T16:00:00.000Z',
      createdAt: '2026-04-13T00:00:00.000Z',
    }),
  ),
  authLogin: createdExample(
    'Login successful.',
    successEnvelope('Login successful', {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
      user: authUserExample,
    }),
  ),
  authRefresh: createdExample(
    'Token refreshed successfully.',
    successEnvelope('Token refreshed successfully', {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshed',
      user: authUserExample,
    }),
  ),
  authLogout: createdExample(
    'Logged out successfully.',
    successEnvelope('Logged out successfully', null),
  ),
  authActivationValidate: okExample(
    'Activation token validated successfully.',
    successEnvelope('Activation token validated successfully', {
      email: 'staff@ecommerce.local',
      fullName: 'Staff User',
      expiresAt: '2026-04-30T18:00:00.000Z',
    }),
  ),
  authActivationComplete: okExample(
    'User activated successfully.',
    successEnvelope('User activated successfully', null),
  ),
  authActivationResend: okExample(
    'Activation email resend processed successfully.',
    successEnvelope('Activation email resend processed successfully', null),
  ),
  authEmailChangeValidate: okExample(
    'Email change token validated successfully.',
    successEnvelope('Email change token validated successfully', {
      currentEmail: 'staff@ecommerce.local',
      newEmail: 'nuevo@ecommerce.local',
      fullName: 'Staff User',
      expiresAt: '2026-05-04T18:00:00.000Z',
    }),
  ),
  authEmailChangeConfirm: okExample(
    'Email changed successfully.',
    successEnvelope('Email changed successfully', null),
  ),
  authPasswordResetRequest: okExample(
    'Password reset request processed successfully.',
    successEnvelope('Password reset request processed successfully', null),
  ),
  authPasswordResetValidate: okExample(
    'Password reset token validated successfully.',
    successEnvelope('Password reset token validated successfully', {
      email: 'staff@ecommerce.local',
      fullName: 'Staff User',
      expiresAt: '2026-05-08T20:00:00.000Z',
    }),
  ),
  authPasswordResetComplete: okExample(
    'Password reset completed successfully.',
    successEnvelope('Password reset completed successfully', null),
  ),
  categoriesList: okExample(
    'Categories retrieved successfully.',
    successEnvelope('Categories retrieved successfully', {
      categories: [categoryExample],
      totalCount: 1,
      totalPages: 1,
      nextCursor: null,
      prevCursor: null,
    }),
  ),
  categoryCreated: createdExample(
    'Category created successfully.',
    successEnvelope('Category created successfully', categoryExample),
  ),
  categoryBatchCreated: createdExample(
    'Batch categories created successfully.',
    successEnvelope(
      'Batch categories created successfully',
      batchResultExample,
    ),
  ),
  categoryRetrieved: okExample(
    'Category retrieved successfully.',
    successEnvelope('Category retrieved successfully', {
      ...categoryExample,
      children: [],
    }),
  ),
  categoryUpdated: okExample(
    'Category updated successfully.',
    successEnvelope('Category updated successfully', categoryExample),
  ),
  categoryDeleted: okExample(
    'Category deleted successfully.',
    successEnvelope('Category deleted successfully', {
      category: categoryExample,
    }),
  ),
  categoryChildrenSynced: okExample(
    'Batch categories synced.',
    successEnvelope(
      'Batch categories synced',
      syncChildrenResultExample,
    ),
  ),
  brandsList: okExample(
    'Brands retrieved successfully.',
    successEnvelope('brands  retrieved successfully', {
      brands: [brandExample],
      totalCount: 1,
      totalPages: 1,
      nextCursor: null,
      prevCursor: null,
    }),
  ),
  brandBatchCreated: createdExample(
    'Batch brands created successfully.',
    successEnvelope(
      'Batch categories created successfully',
      batchResultExample,
    ),
  ),
  brandCreated: createdExample(
    'Brand created successfully.',
    successEnvelope('Category created successfully', brandExample),
  ),
  brandRetrieved: okExample(
    'Brand retrieved successfully.',
    successEnvelope('Brand retrieved successfully', brandExample),
  ),
  brandUpdated: okExample(
    'Brand updated successfully.',
    successEnvelope('Brand updated successfully', brandExample),
  ),
  brandDeleted: okExample(
    'Brand deleted successfully.',
    successEnvelope('Brand deleted successfully', true),
  ),
  brandActiveToggled: createdExample(
    'Brand active status toggled successfully.',
    successEnvelope('Brand true successfully', true),
  ),
  brandVisibleInMenuToggled: createdExample(
    'Brand menu visibility toggled successfully.',
    successEnvelope('Brand true successfully', true),
  ),
  productsList: okExample(
    'Products retrieved successfully.',
    successEnvelope('Products retrieved successfully', {
      products: [productExample],
      totalCount: 1,
      totalPages: 1,
    }),
  ),
  productCreated: createdExample(
    'Product created successfully.',
    successEnvelope('Product created successfully', {
      product: productExample,
    }),
  ),
  productBatchCreated: createdExample(
    'Batch products created successfully.',
    successEnvelope('Batch products created successfully', batchResultExample),
  ),
  productRetrieved: okExample(
    'Product retrieved successfully.',
    successEnvelope('Product retrieved successfully', {
      product: productExample,
    }),
  ),
  productUpdated: okExample(
    'Product updated successfully.',
    successEnvelope('Product updated successfully', {
      product: productExample,
    }),
  ),
  productDeleted: okExample(
    'Product deleted successfully.',
    successEnvelope('Product deleted successfully', {
      product: {
        ...productExample,
        isActive: false,
        isFeatured: false,
        categories: [],
        directAttributes: [],
        attributes: [],
        variants: [],
      },
    }),
  ),
  productStatusUpdated: okExample(
    'Product status updated successfully.',
    successEnvelope('Product status updated successfully', {
      success: true,
    }),
  ),
  productFeaturedUpdated: okExample(
    'Product featured status updated successfully.',
    successEnvelope('Product featured status updated successfully', {
      success: true,
    }),
  ),
  variantsList: okExample(
    'Variants retrieved successfully.',
    successEnvelope('Variants retrieved successfully', {
      variants: [variantExample],
      pagination: {
        offset: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
        },
      },
    }),
  ),
  ordersList: okExample(
    'Orders retrieved successfully.',
    successEnvelope('Orders retrieved successfully', {
      orders: [orderExample],
      totalCount: 1,
      totalPages: 1,
    }),
  ),
  variantCreated: createdExample(
    'Variant created successfully.',
    successEnvelope('Variant created successfully', {
      variant: variantExample,
    }),
  ),
  variantRetrieved: okExample(
    'Variant retrieved successfully.',
    successEnvelope('Variant retrieved successfully', {
      variant: variantExample,
    }),
  ),
  variantUpdated: okExample(
    'Variant updated successfully.',
    successEnvelope('Variant updated successfully', {
      variant: variantExample,
    }),
  ),
  variantStatusUpdated: okExample(
    'Variant status updated successfully.',
    successEnvelope('Variant status updated successfully', {
      success: true,
    }),
  ),
  variantDeleted: okExample(
    'Variant deleted successfully.',
    successEnvelope('Variant deleted successfully', {
      variant: {
        ...variantExample,
        attributeValues: [],
      },
    }),
  ),
  compositeCategories: okExample(
    'Categories page data retrieved successfully.',
    successEnvelope('Categories page data retrieved successfully', {
      table: {
        categories: [categoryExample],
        totalCount: 1,
        totalPages: 1,
      },
    }),
  ),
  compositeCategoryChildren: okExample(
    'Category children page data retrieved successfully.',
    successEnvelope('Category children page data retrieved successfully', {
      category: {
        ...categoryExample,
        children: [],
      },
    }),
  ),
  compositeBrands: okExample(
    'Brands page data retrieved successfully.',
    successEnvelope('Brands page data retrieved successfully', {
      table: {
        brands: [brandExample],
        totalCount: 1,
        totalPages: 1,
      },
    }),
  ),
  compositeAttributes: okExample(
    'Attributes page data retrieved successfully.',
    successEnvelope('Attributes page data retrieved successfully', {
      table: {
        attributes: [attributeExample],
        totalCount: 1,
        totalPages: 1,
      },
    }),
  ),
  compositeAttributesCreateDialog: okExample(
    'Attributes create dialog data retrieved successfully.',
    successEnvelope('Attributes create dialog data retrieved successfully', {
      categories: [
        {
          id: categoryExample.id,
          name: categoryExample.name,
          slug: categoryExample.slug,
        },
      ],
    }),
  ),
  compositeRegisterAttribute: okExample(
    'Attribute register composite data retrieved successfully.',
    successEnvelope(
      'Attribute register composite data retrieved successfully',
      {
        form: {
          categories: [
            {
              id: categoryExample.id,
              name: categoryExample.name,
              slug: categoryExample.slug,
            },
          ],
        },
      },
    ),
  ),
  compositeBulkAttributeRegistration: okExample(
    'Attribute bulk registration composite data retrieved successfully.',
    successEnvelope(
      'Attribute bulk registration composite data retrieved successfully',
      {
        form: {
          categories: [
            {
              id: categoryExample.id,
              name: categoryExample.name,
              slug: categoryExample.slug,
            },
          ],
        },
      },
    ),
  ),
  compositeSyncCategory: okExample(
    'Category sync composite data retrieved successfully.',
    successEnvelope('Category sync composite data retrieved successfully', {
      category: categoryExample,
      children: [
        {
          ...categoryExample,
          id: '018f4dc4-5f51-7c55-9b8f-15fbdd99b102',
          parent: {
            id: categoryExample.id,
            name: categoryExample.name,
            slug: categoryExample.slug,
          },
          name: 'Trail Shoes',
          slug: 'trail-shoes',
        },
      ],
    }),
  ),
};
