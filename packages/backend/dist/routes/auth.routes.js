"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("@controllers/auth.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validate_request_1 = require("@middlewares/validate-request");
const router = (0, express_1.Router)();
exports.authRouter = router;
/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post('/register', [
    (0, express_validator_1.body)('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es requerido')
        .isEmail()
        .withMessage('Correo electrónico inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
], validate_request_1.validateRequest, auth_controller_1.AuthController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Público
 */
router.post('/login', [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es requerido')
        .isEmail()
        .withMessage('Correo electrónico inválido'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
], validate_request_1.validateRequest, auth_controller_1.AuthController.login);
/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Privado
 */
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.logout);
/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Privado
 */
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.getPerfil);
