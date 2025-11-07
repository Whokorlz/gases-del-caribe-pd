"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sesion = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
let Sesion = class Sesion {
};
exports.Sesion = Sesion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Sesion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.sesiones, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", Usuario_1.Usuario)
], Sesion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'usuario_id' }),
    __metadata("design:type", String)
], Sesion.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Sesion.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'direccion_ip' }),
    __metadata("design:type", String)
], Sesion.prototype, "direccionIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'agente_usuario', nullable: true }),
    __metadata("design:type", String)
], Sesion.prototype, "agenteUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Sesion.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], Sesion.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'fecha_cierre', nullable: true }),
    __metadata("design:type", Date)
], Sesion.prototype, "fechaCierre", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'fecha_actualizacion' }),
    __metadata("design:type", Date)
], Sesion.prototype, "fechaActualizacion", void 0);
exports.Sesion = Sesion = __decorate([
    (0, typeorm_1.Entity)('sesiones')
], Sesion);
