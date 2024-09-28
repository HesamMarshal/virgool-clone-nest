import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.util";
import { BlogStatus } from "./enum/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PublicMessage } from "src/common/enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;

    let { title, slug, content, description, time_for_study, image } = blogDto;
    let slugData = slug ?? title;
    slug = createSlug(slugData);
    const isExist = await this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }

    const blog = this.blogRepository.create({
      title,
      slug,
      content,
      description,
      time_for_study,
      image,
      status: BlogStatus.Draft,
      authorID: user.id,
    });

    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.Created,
    };
  }
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }
}
