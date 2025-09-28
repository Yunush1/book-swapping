const BadRequestError = require('./badRequest');

module.exports={
    ApiError:require('./apiError'),
    ConflictError:require('./conflicError'),
    NotFoundError:require('./notFound'),
    UnauthorizedError:require('./unauthorizedError'),
    TokenExpiredError:require('./tokenExpiredError'),
    BadRequestError:require('./badRequest')
}