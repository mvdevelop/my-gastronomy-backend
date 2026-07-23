interface HttpResponse<T> {
    success: boolean;
    statusCode: number;
    body: T;
}

export const ok = <T>(body: T): HttpResponse<T> => {
    return {
        success: true,
        statusCode: 200,
        body
    };
};

export const serverError = <T>(error: unknown): HttpResponse<T> => {
    console.error(error);
    return {
        success: false,
        statusCode: 500,
        body: {
            message: 'Internal server error'
        } as T
    };
};

export const notFound = <T>(message: string): HttpResponse<T> => {
    return {
        success: false,
        statusCode: 404,
        body: { message } as T
    };
};

export const badRequest = <T>(message: string): HttpResponse<T> => {
    return {
        success: false,
        statusCode: 400,
        body: { message } as T
    };
};
