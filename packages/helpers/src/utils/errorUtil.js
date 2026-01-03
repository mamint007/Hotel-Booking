"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServiceError = exports.ServiceError = exports.ValidationError = void 0;
class ValidationError extends Error {
    statusCode;
    resCode;
    resDesc;
    details;
    constructor(error) {
        super();
        this.name = 'Validation Error';
        this.statusCode = error.statusCode;
        this.resCode = error.resCode;
        this.resDesc = error.resDesc;
        this.details = error.details;
    }
}
exports.ValidationError = ValidationError;
class ServiceError extends Error {
    statusCode;
    resCode;
    resDesc;
    additional;
    constructor(error) {
        super();
        this.name = 'Service Error';
        this.statusCode = error.statusCode;
        this.resCode = error.resCode;
        this.resDesc = error.resDesc;
        this.additional = error.additional;
    }
}
exports.ServiceError = ServiceError;
class InternalServiceError extends Error {
    statusCode;
    resCode;
    resDesc;
    constructor(error) {
        super();
        this.name = 'Internal Service Error';
        this.statusCode = 500;
        this.resCode = error.resCode;
        this.resDesc = error.resDesc;
    }
}
exports.InternalServiceError = InternalServiceError;
