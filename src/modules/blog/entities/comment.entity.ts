import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BlogComments)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;

  @Column({ default: false })
  accepted: boolean;

  @Column()
  blogId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  parentId: number;

  // realtions
  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, {
    onDelete: "CASCADE",
  })
  blog: BlogEntity;

  @ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
    onDelete: "CASCADE",
  })
  parent: BlogCommentEntity;

  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  @JoinColumn({ name: "parent" })
  children: BlogCommentEntity[];

  //   Date & Time
  @CreateDateColumn()
  created_at: Date;
}
