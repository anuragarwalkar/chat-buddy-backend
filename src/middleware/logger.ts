const logger = (err: any, req: any, res: any, next: any) => {
    let error = {...err};
    error['message'] = err.message;

    const statusCode = error.statusCode || 500;
    const errorMessage =  error.message || 'Server Error';

    res.status(statusCode).json({
        success:false,
        error:errorMessage
    })
}

export default logger;