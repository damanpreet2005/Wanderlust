const Joi = require('joi');

module.exports.listingSchema= Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.object({
            url: Joi.string().uri().allow('', null).optional(),
            filename: Joi.string().optional()
        }).allow(null).optional(),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
}).required();