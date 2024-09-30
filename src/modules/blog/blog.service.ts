import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.util";
import { BlogStatus } from "./enum/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
  BadRequestMessage,
  PublicMessage,
} from "src/common/enums/message.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./entities/blog-category.entity";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;

    let {
      title,
      slug,
      content,
      description,
      time_for_study,
      image,
      categories,
    } = blogDto;

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!categories) {
      throw new BadRequestException(BadRequestMessage.InvalidCategories);
    }

    let slugData = slug ?? title;
    slug = createSlug(slugData);
    const isExist = await this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }

    let blog = this.blogRepository.create({
      title,
      slug,
      content,
      description,
      time_for_study,
      image,
      status: BlogStatus.Draft,
      authorID: user.id,
    });

    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      console.log(category);

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

    return {
      message: PublicMessage.Created,
    };
  }

  async myBlog() {
    const { id } = this.request.user;
    return this.blogRepository.find({
      where: {
        authorID: id,
      },
      order: { id: "DESC" },
    });
  }

  async blogList(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: { id: "DESC" },
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      blogs,
    };
  }

  // Helpers
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }
}
