const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        price : Joi.number().required().min(0),
        country : Joi.string().required(),
        // image : Joi.string().allow("", null)
        image: Joi.object({
      url: Joi.string().uri().allow("", null), // validate URL
      filename: Joi.string().optional()
    }).optional()

    }).required()
});



module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.string().required().min(0).max(5),
        comment : Joi.string().required(),
       
    }).required()
});