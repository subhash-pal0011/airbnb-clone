const Joi = require('joi');
const noNumbersOnly = Joi.string()
.min(5)
.pattern(/[a-zA-Z]/) 
.required()
.messages({
    'string.pattern.base': `"{{#label}}" should not be just numbers`,
    'string.base': `"{{#label}}" must be a string`,
    'string.min': `"{{#label}}" should have at least 5 characters`,
    'any.required': `"{{#label}}" is required`
});

const mainSchemaJoi = Joi.object({
    title: noNumbersOnly.label("Title"),
    description: noNumbersOnly.label("Description"),
    location: noNumbersOnly.label("Location"),
    country: noNumbersOnly.label("Country"),
    price: Joi.number(),

    image: Joi.string().allow('', null).optional().label("Image") 
});



const ReviewJio = Joi.object({
    Comment: noNumbersOnly.label("Comment"),
    rating: Joi.number().min(1).max(5).required().label("rating")  
});

module.exports = { 
    mainSchemaJoi,
    ReviewJio
};

