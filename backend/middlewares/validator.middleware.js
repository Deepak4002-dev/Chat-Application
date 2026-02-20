import AppError from "../utils/AppError.js";
const validator = (schema,property='body')=>{
  return (req,res,next)=>{
    const {error,value} = schema.validate(req[property],{
      abortEarly:false,
      stripUnknown:true
    });

    if(error)
    {
      const errors = error.details.map((detail)=>{
        return {
          field:detail.path.join("."),
          message: detail.message.replace(/['"]/g, '')
        }
      })

      const appError = new AppError('Validation Error',400,errors);
      return next(appError);
    }

    req[property] = value;
    next();
  }
}

export {validator}