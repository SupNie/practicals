const Joi = require("joi");

const validateBook = (req, res, next) => 
{
  const schema = Joi.object
  ({
    title: Joi.string().max(255).required(),
    author: Joi.string().max(255).required(),
    availability: Joi.string(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) 
  {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

//module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = validateBook;