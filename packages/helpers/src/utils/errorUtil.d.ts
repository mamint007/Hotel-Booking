import { FieldValidationError } from 'express-validator';
export declare class ValidationError extends Error {
    statusCode: number;
    resCode: string;
    resDesc: Record<string, string>;
    details: FieldValidationError[];
    constructor(error: {
        statusCode: number;
        resCode: string;
        resDesc: Record<string, string>;
        details: FieldValidationError[];
    });
}
export declare class ServiceError extends Error {
    statusCode: number;
    resCode: string;
    resDesc: Record<string, string>;
    additional?: any;
    constructor(error: {
        statusCode: number;
        resCode: string;
        resDesc: Record<string, string>;
        additional?: any;
    });
}
export declare class InternalServiceError extends Error {
    statusCode: number;
    resCode: string;
    resDesc: string;
    constructor(error: {
        resCode: string;
        resDesc: string;
    });
}
//# sourceMappingURL=errorUtil.d.ts.map