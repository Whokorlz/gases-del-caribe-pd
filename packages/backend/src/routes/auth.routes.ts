import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '@controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validateRequest } from '@middlewares/validate-request';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post(
  '/register',
  [
    body('nombre')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El correo electrónico es requerido')
      .isEmail()
      .withMessage('Correo electrónico inválido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validateRequest,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Público
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El correo electrónico es requerido')
      .isEmail()
      .withMessage('Correo electrónico inválido'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida'),
  ],
  validateRequest,
  AuthController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Privado
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Privado
 */
router.get('/me', authMiddleware, AuthController.getPerfil);

export { router as authRouter };
