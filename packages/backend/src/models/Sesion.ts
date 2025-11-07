import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('sesiones')
export class Sesion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.sesiones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'varchar', length: 500 })
  token!: string;

  @Column({ type: 'varchar', length: 100, name: 'direccion_ip' })
  direccionIp!: string;

  @Column({ type: 'text', name: 'agente_usuario', nullable: true })
  agenteUsuario?: string;

  @Column({ type: 'boolean', default: true })
  activa!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @Column({ type: 'timestamp', name: 'fecha_cierre', nullable: true })
  fechaCierre?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;
}