import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "./cat.entity";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";

const mockCats = [
  {
    id: 1,
    age: 2,
    breed: "Bombay",
    name: "Pixel",
  },
];

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  const mockCatRepository: Partial<Repository<Cat>> = {
    find: jest.fn().mockImplementation(async () => mockCats),
    findOne: jest
      .fn()
      .mockImplementation(
        async (id: number) => mockCats.find((cat) => cat.id === id) || null
      ),
    save: jest
      .fn()
      .mockImplementation(async (cat: CreateCatDto) =>
        mockCats.push({ id: mockCats.length + 1, ...cat })
      ),
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

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      expect(await catsController.findAll()).toBe(mockCats);
    });
  });
});
