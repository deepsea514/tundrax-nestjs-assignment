import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "./cat.entity";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";

const mockCats = [];

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  const mockCatRepository: Partial<Repository<Cat>> = {
    find: jest.fn().mockImplementation(async () => mockCats),
    findOne: jest
      .fn()
      .mockImplementation(
        async (options: any) =>
          mockCats.find((cat) => cat.id === options.where.id) || null
      ),
    save: jest.fn().mockImplementation(async (cat: CreateCatDto) => {
      const newCat = { id: mockCats.length + 1, ...cat };
      mockCats.push(newCat);
      return newCat;
    }),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: getRepositoryToken(Cat),
          useValue: mockCatRepository,
        },
        CatsService,
      ],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  it("should be defined", () => {
    expect(catsService).toBeDefined();
    expect(catsController).toBeDefined();
  });

  describe("create and check", () => {
    it("findAll with Empty", async () => {
      expect(await catsController.findAll()).toHaveLength(0);
    });

    it("findOne with Empty", async () => {
      expect(await catsController.findOne(1)).toBe(null);
    });

    const cat = {
      age: 2,
      breed: "Bombay",
      name: "Pixel",
    };

    const newCat = { id: 1, ...cat };

    it("create a cat", async () => {
      expect(await catsController.create(cat)).toStrictEqual(newCat);
    });

    it("findAll with value", async () => {
      expect(await catsController.findAll()).toStrictEqual([newCat]);
    });

    it("findOne with value", async () => {
      expect(await catsController.findOne(1)).toStrictEqual(newCat);
    });
  });
});
