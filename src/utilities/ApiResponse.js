class ApiResponse {
    constructor(message = '', data = {}, statusCode, success) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = success;
    }
}

export { ApiResponse };