import { Product } from './product.entity';
import { ProductService } from './product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductDto } from './dto/product.dto';
import { Validate } from '../../validators/validation';
import {
  ArgumentMetadata,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';

describe('ProductController', () => {
  let productService: any;
  let productController: ProductController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
            createProduct: jest.fn(),
            productDetail: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            reviewProduct: jest.fn(),
          },
        },
        ProductDto,
      ],
    }).compile();
    productService = moduleRef.get<ProductService>(ProductService);
    productController = moduleRef.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  const targetId: Validate = new Validate();
  const metadataBody: ArgumentMetadata = {
    type: 'body',
    metatype: ProductDto,
    data: '',
  };

  describe('createProduct', () => {
    it('should create a product', async () => {
      const product = new Product();
      const dto: ProductDto = {
        ...product,
        name: 'test',
        price: 1,
        description: 'test',
        category: 'test',
      };
      productService.create.mockReturnValue(dto);
      expect(await productController.createProduct(dto)).toEqual(dto);
    });

    it('should throw an error message if the product is missing required fields', async () => {
      const dto = {};
      await target.transform(<ProductDto>dto, metadataBody).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'name must be a string',
          'price must be an integer number',
          'description must be a string',
          'category must be a string',
        ]);
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [new Product()];
      productService.findAll.mockReturnValue(products);
      expect(await productController.getAllProducts()).toEqual(products);
    });
  });

  describe('productDetail', () => {
    it('should return a product', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const product = new Product();
      productService.findOne.mockReturnValue(product);
      expect(await productController.productDetail(id)).toEqual(product);
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      productService.findOne.mockReturnValue(null);
      await expect(productController.productDetail(id)).rejects.toEqual(
        new HttpException('Product not found', 404),
      );
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });
  });

  describe('editProduct', () => {
    it('should edit a product', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const product = new Product();
      const editProduct = {
        ...product,
        name: 'test',
        price: 1,
        description: 'test',
      };
      productService.update.mockReturnValue(editProduct);
      expect(await productController.update(id, product)).toEqual(editProduct);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      productService.update.mockReturnValue('Product not found');
      expect(await productController.update(id, new Product())).toEqual(
        'Product not found',
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const product = new Product();
      productService.remove.mockReturnValue(product);
      expect(await productController.deleteProduct(id)).toEqual(product);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      productService.remove.mockReturnValue('Product not found');
      expect(await productController.deleteProduct(id)).toEqual(
        'Product not found',
      );
    });
  });

  describe('reviewProduct', () => {
    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });

    it('should add a review', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const review = {
        rating: 1,
        comment: 'test',
        createdAt: new Date(),
      };
      let product = new Product();
      product = { ...product, reviews: [review] };
      productService.addReview.mockReturnValue(product);
      expect(await productController.reviewProduct(id, review)).toEqual(
        product,
      );
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const review = {
        rating: 1,
        comment: 'test',
      };
      productService.addReview.mockReturnValue('Product not found');
      expect(await productController.reviewProduct(id, review)).toEqual(
        'Product not found',
      );
    });
  });
});
