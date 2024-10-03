import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogLikesEntity } from "./entities/like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";
import { BlogController } from "./controllers/blog.controller";
import { BlogService } from "./services/blog.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
