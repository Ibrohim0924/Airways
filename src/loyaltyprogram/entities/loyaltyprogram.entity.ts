import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum LoyaltyTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = "PLATINUM"

}

@Entity('loyaltys')
export class Loyaltyprogram {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ type: 'int', default: 0 })
    points: number

    @Column({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.BRONZE })
    tier: LoyaltyTier

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;


}
