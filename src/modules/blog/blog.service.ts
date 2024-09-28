import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { createSlug } from "src/common/utils/functions.util";
import { BlogStatus } from "./enum/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request
  ) {}

  create(blogDto: CreateBlogDto) {
    const user = this.request.user;

    let { title, slug, content, description, time_for_study, image } = blogDto;
    let slugData = slug ?? title;
    slug = createSlug(slugData);

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
    return blogDto;
  }
}
