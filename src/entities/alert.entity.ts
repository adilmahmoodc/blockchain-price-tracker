import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string; // e.g., 'Ethereum' or 'Polygon'

  @Column('decimal')
  targetPrice: number; // The target price that triggers the alert

  @Column()
  email: string; // Email to send the alert to

  @Column()
  direction: 'up' | 'down'; // 'up' for price increase, 'down' for price decrease

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date; // When the alert was created
}
