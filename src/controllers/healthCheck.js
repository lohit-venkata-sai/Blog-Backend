import { ApiResponse } from '../utilities/ApiResponse.js';

const healthCheck = async (req, res) => {
    console.log('healthcheck end point hit');
    return res.status(200).json(new ApiResponse('health check successful', {}, 200, true))
}

export { healthCheck };