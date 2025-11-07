import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sesion } from './Sesion';

type Rol = 'usuario' | 'administrador';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ 
    type: 'enum', 
    enum: ['usuario', 'administrador'],
    default: 'usuario' 
  })
  rol!: Rol;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;

  @OneToMany(() => Sesion, (sesion) => sesion.usuario, { cascade: true })
  sesiones!: Sesion[];

  // Método para ocultar campos sensibles al serializar
  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}