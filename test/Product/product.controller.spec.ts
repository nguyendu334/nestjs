import { Product } from '../../src/modules/product/product.entity';
import { ProductService } from '../../src/modules/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../src/modules/product/product.controller';
import { ProductDto } from '../../src/modules/product/dto/product.dto';
import { Validate } from '../../src/validators/validation';
import { ProductNotFoundException } from '../../src/exceptions/product-not-found.exception';
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
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addReview: jest.fn(),
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
        userID: 'test',
      };
      productService.create.mockReturnValue(dto);
      expect(await productController.createProduct(dto)).toEqual(dto);
    });

    it('should throw an error message if the product is missing required fields', async () => {
      const dto = {};
      await target.transform(<ProductDto>dto, metadataBody).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'userId must be a mongodb id',
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

  describe('FindOne', () => {
    it('should return a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      productService.findOne.mockReturnValue(product);
      expect(await productController.productDetail(id)).toEqual(product);
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
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
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });
  });

  describe('editProduct', () => {
    it('should edit a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      const editPtoduct = {
        ...product,
        name: 'test',
        price: 1,
        description: 'test',
      };
      productService.update.mockReturnValue(editPtoduct);
      expect(await productController.update(id, product)).toEqual(editPtoduct);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      productService.update.mockReturnValue(new ProductNotFoundException());
      expect(await productController.update(id, new Product())).toEqual(
        new ProductNotFoundException(),
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      productService.remove.mockReturnValue(product);
      expect(await productController.deleteProduct(id)).toEqual(product);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      productService.remove.mockReturnValue(new ProductNotFoundException());
      expect(await productController.deleteProduct(id)).toEqual(
        new ProductNotFoundException(),
      );
    });
  });

  describe('reviewProduct', () => {
    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should add a review', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const review = {
        userId: 'test',
        rating: 1,
        comment: 'test',
        email: 'meat@gmail.com',
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
      const id = '62df82997d5db3aa7cf4cc53';
      const review = {
        userId: 'test',
        rating: 1,
        comment: 'test',
        email: 'test@gmail.com',
      };
      productService.addReview.mockReturnValue(new ProductNotFoundException());
      expect(await productController.reviewProduct(id, review)).toEqual(
        new ProductNotFoundException(),
      );
    });
  });
});
