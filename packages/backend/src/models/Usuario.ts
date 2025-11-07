import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Sesion } from './Sesion';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nombre!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Sesion, (sesion) => sesion.usuario)
  sesiones!: Relation<Sesion[]>;
}