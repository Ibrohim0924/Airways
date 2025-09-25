import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";

@Entity('news')
export class News {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 255 })
    title: string

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @ManyToOne(() => Admin, (admin) => admin.news, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    createdBy: Admin
}
