class ApiError extends Error {
    constructor(
        statuscode,
        message="Something went wrong",
        errors = [],
        statck=""
    ){
        super(message)  // ye overwrite kar rhe h
        this.statusCode=this.statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors


        if (statck) {
            this.stack = statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}