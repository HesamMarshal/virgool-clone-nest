import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";

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

  // Date and time
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  // Relations

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;
}
