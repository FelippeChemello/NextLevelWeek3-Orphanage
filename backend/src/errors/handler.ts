import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors {
    [key: string]: string[]; //Objeto com chaves sendo strings e seus valores sendo um array de strings
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    console.error(error)

    if (error instanceof ValidationError) {
        let errors: ValidationErrors = {}
        
        error.inner.forEach(err => {
            errors[err.path] = err.errors
        })

        return response.status(400).json({ message: 'Validation fails', errors })
    }

    return response.status(500).json({ message: 'Internal Server Error' })
}

export default errorHandler