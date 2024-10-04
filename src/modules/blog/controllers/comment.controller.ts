import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consume.enum";
import { AuthGuard } from "../../auth/guards/auth.guard";

import { BlogService } from "../services/blog.service";
import { BlogCommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { FilterBlog } from "src/common/decorators/filter.decorator copy";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { FilterBlogDto } from "../dto/blog.dto";

@Controller("blog-comment")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}
  @Post("/")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto);
  }

  @Get("/")
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto);
  }
}
