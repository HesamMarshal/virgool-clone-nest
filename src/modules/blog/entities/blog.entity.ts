import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./comment.entity";

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  authorID: number;

  @Column({ default: BlogStatus.Draft })
  status: string;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;

  @OneToMany(() => BlogLikesEntity, (like) => like.blog)
  likes: BlogLikesEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
  comments: BlogCommentEntity[];

  // Date and time
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
