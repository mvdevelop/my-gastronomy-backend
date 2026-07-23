export interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    body: T;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
    success: true;
}

export interface ErrorResponse extends ApiResponse<{ message: string }> {
    success: false;
}
