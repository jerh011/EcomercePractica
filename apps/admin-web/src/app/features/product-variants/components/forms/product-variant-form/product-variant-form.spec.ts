import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeProductVariantSummary } from '@product-variants/types/attribute.type';

import { ProductVariantForm } from './product-variant-form';

describe('ProductVariantForm', () => {
  let component: ProductVariantForm;
  let fixture: ComponentFixture<ProductVariantForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVariantForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductVariantForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps dimensions controls aligned with the product variant model shape', () => {
    expect(Object.keys(component.formGroup.controls.dimensions.controls)).toEqual(
      ['width', 'height', 'length', 'weight'],
    );
  });

  it('disables product-dependent controls until a product is selected', () => {
    expect(component.formGroup.controls.product.enabled).toBe(true);
    expect(component.formGroup.controls.name.disabled).toBe(true);
    expect(component.formGroup.controls.sku.disabled).toBe(true);
    expect(component.formGroup.controls.price.disabled).toBe(true);
    expect(component.formGroup.controls.minimumStock.disabled).toBe(true);
    expect(component.formGroup.controls.isActive.disabled).toBe(true);
    expect(component.formGroup.controls.images.disabled).toBe(true);
    expect(component.formGroup.controls.attributes.disabled).toBe(true);
    expect(component.formGroup.controls.attributeValues.disabled).toBe(true);

    component.formGroup.controls.product.setValue({
      id: 'product-1',
      name: 'Producto',
      slug: 'producto',
    });

    expect(component.formGroup.controls.name.enabled).toBe(true);
    expect(component.formGroup.controls.sku.enabled).toBe(true);
    expect(component.formGroup.controls.price.enabled).toBe(true);
    expect(component.formGroup.controls.minimumStock.enabled).toBe(true);
    expect(component.formGroup.controls.isActive.enabled).toBe(true);
    expect(component.formGroup.controls.images.enabled).toBe(true);
    expect(component.formGroup.controls.attributes.enabled).toBe(true);
    expect(component.formGroup.controls.attributeValues.enabled).toBe(true);
  });

  it('validates minimum stock as a non-negative integer', () => {
    const minimumStockControl = component.formGroup.controls.minimumStock;

    minimumStockControl.enable();

    minimumStockControl.setValue('1.5');

    expect(minimumStockControl.hasError('nonNegativeInteger')).toBe(true);

    minimumStockControl.setValue('12');

    expect(minimumStockControl.valid).toBe(true);
  });

  it('validates sku length and allowed characters', () => {
    const skuControl = component.formGroup.controls.sku;

    skuControl.enable();
    skuControl.setValue('SKU1');

    expect(skuControl.hasError('pattern')).toBe(true);

    skuControl.setValue('SKU_12345');

    expect(skuControl.hasError('pattern')).toBe(true);

    skuControl.setValue('SKU-12345');

    expect(skuControl.hasError('pattern')).toBe(false);
  });

  it('validates barcode gtin format and check digit', () => {
    const barcodeControl = component.formGroup.controls.barcode;

    barcodeControl.enable();
    barcodeControl.setValue('ABC');

    expect(barcodeControl.hasError('barcodeGtinDigits')).toBe(true);

    barcodeControl.setValue('12345');

    expect(barcodeControl.hasError('barcodeGtinLength')).toBe(true);

    barcodeControl.setValue('12345671');

    expect(barcodeControl.hasError('barcodeGtinCheckDigit')).toBe(true);

    barcodeControl.setValue('96385074');

    expect(barcodeControl.valid).toBe(true);
  });

  it('requires values for all effective attributes', () => {
    component.formGroup.controls.attributeValues.enable();
    component.formGroup.controls.attributeValues.setValue([
      {
        attribute: {
          id: 'attribute-effective',
          name: 'Color',
          slug: 'color',
          isRequired: false,
        },
        value: '',
      },
    ]);

    expect(
      component.formGroup.controls.attributeValues.hasError(
        'effectiveAttributeValues',
      ),
    ).toBe(true);

    component.formGroup.controls.attributeValues.setValue([
      {
        attribute: {
          id: 'attribute-required',
          name: 'Color',
          slug: 'color',
          isRequired: false,
        },
        value: 'Negro',
      },
    ]);

    expect(component.formGroup.controls.attributeValues.valid).toBe(true);
  });

  it('selects all effective attributes by default and restores them when removed', async () => {
    const requiredAttribute: AttributeProductVariantSummary = {
      id: 'attribute-required',
      name: 'Color',
      slug: 'color',
      isRequired: true,
    };
    const optionalAttribute: AttributeProductVariantSummary = {
      id: 'attribute-optional',
      name: 'Material',
      slug: 'material',
      isRequired: false,
    };

    fixture.componentRef.setInput('attributesOptions', [
      { label: 'Color', value: requiredAttribute },
      { label: 'Material', value: optionalAttribute },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.formGroup.controls.attributes.value).toEqual([
      requiredAttribute,
      optionalAttribute,
    ]);

    component.formGroup.controls.attributes.setValue([optionalAttribute]);

    expect(component.formGroup.controls.attributes.value).toEqual([
      optionalAttribute,
      requiredAttribute,
    ]);
  });

  it('selects product attributes even when they are not required', async () => {
    const directAttribute: AttributeProductVariantSummary = {
      id: 'attribute-direct',
      name: 'Material',
      slug: 'material',
      isRequired: false,
    };

    fixture.componentRef.setInput('directAttributes', [directAttribute]);
    fixture.componentRef.setInput('attributesOptions', [
      { label: 'Material', value: directAttribute },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.formGroup.controls.attributes.value).toEqual([
      directAttribute,
    ]);
  });
});
