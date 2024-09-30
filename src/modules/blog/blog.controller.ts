import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/blog.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consume.enum";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller("blog")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post("/")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createBlog(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto);
  }

  @Get("/my")
  myBlogs() {
    return this.blogService.myBlog();
  }
}
