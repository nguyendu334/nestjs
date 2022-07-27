import { Product } from '../../src/modules/product/product.entity';
import { ProductService } from '../../src/modules/product/product.service';
import { MockType, repositoryMockFactory } from '../mocker';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let productService: ProductService;
  let repositoryMock: MockType<Repository<Product>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    repositoryMock = moduleRef.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the product does not exist', async () => {
    repositoryMock.findOneBy.mockReturnValue(null);
    expect(() => productService.productDetail('id')).toThrow();
  });

  it('should find a product by id', async () => {
    const product = {
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
    };
    repositoryMock.findOneBy.mockReturnValue(product);
    expect(productService.productDetail(product._id)).toEqual(product);
  });

  it('should get all products', async () => {
    const products = [
      {
        name: 'product',
        _id: '62d133dff7b8b0612355b4a6',
        price: 10,
        description: 'description',
      },
      {
        name: 'product',
        _id: '62d133dff7b8b0612355b4a6',
        price: 10,
        description: 'description',
      },
    ];
    repositoryMock.find.mockReturnValue(products);
    expect(productService.getAllProducts()).toEqual(products);
  });

  it('should create a product', async () => {
    const prod = new Product();
    const product = {
      ...prod,
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
      userID: '62d133dff7b8b0612355b4a6',
    };
    repositoryMock.save.mockReturnValue(product);
    expect(productService.createProduct(product)).toEqual(product);
  });

  it('should edit a product', async () => {
    const product = {
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
      userID: '62d133dff7b8b0612355b4a6',
    };
    repositoryMock.update.mockReturnValue(product);
    expect(await productService.editProduct(product._id, product)).toEqual(
      product,
    );
  });

  it('should delete a product', async () => {
    const product = {
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
      userId: '62d133dff7b8b0612355b4a6',
    };
    repositoryMock.delete.mockReturnValue(product);
    expect(await productService.deleteProduct(product._id)).toEqual(product);
  });
  it('should add a review to a product', async () => {
    const review = {
      userId: '62d133dff7b8b0612355b4a6',
      rating: 5,
      comment: 'comment',
      email: 'email',
      createdAt: new Date(),
    };
    const product = {
      reviews: [],
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
      userId: '62d133dff7b8b0612355b4a6',
    };
    repositoryMock.findOneBy.mockReturnValue(product);
    repositoryMock.save.mockReturnValue(product);
    expect(await productService.reviewProduct(product._id, review)).toEqual(
      product,
    );
  });
});
