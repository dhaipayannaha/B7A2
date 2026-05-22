

import type { Response } from 'express';
import type { TResponse } from './sendResponseinterface';



const sendResponse = <T>(res: Response, data : TResponse<T>) => {
    res.status(data.statusCode).json({
      success: data.success,
      message: data.message,
      data: data.data,
      error: data.error
    })
}

export default sendResponse