class ApiResponse {
    constructor(message = '', data = {}, statusCode = 200, success = null) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = success;
    }
}

export { ApiResponse };