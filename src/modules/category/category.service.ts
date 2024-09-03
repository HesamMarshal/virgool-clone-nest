import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { CategoryMessage, PublicMessage } from "src/common/enums/message.enum";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let { title, priority } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = this.categoryRepository.create({
      title,
      priority,
    });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
      category,
    };
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  //
  async checkExistAndResolveTitle(title: string) {
    title = title?.trim().toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(CategoryMessage.AlreadyExist);

    return title;
  }
}
