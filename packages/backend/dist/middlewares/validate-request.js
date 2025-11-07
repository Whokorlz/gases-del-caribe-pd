"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const isFieldError = (error) => {
    return 'path' in error && typeof error.path === 'string';
};
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: isFieldError(err) ? err.path : 'general',
                message: err.msg,
            })),
        });
    }
    next();
};
exports.validateRequest = validateRequest;
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: isFieldError(err) ? err.path : 'general',
                message: err.msg,
            })),
        });
    };
};
exports.validate = validate;
