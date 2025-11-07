import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Usuario } from './Usuario';

@Entity()
export class Sesion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @Column({ type: 'timestamp' })
  expires!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.sesiones)
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Relation<Usuario>;

  @Column()
  usuarioId!: string;
}