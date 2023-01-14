const joi = require('joi')

module.exports.coachgroundSchema = joi.object({
            coachground: joi.object({
                title: joi.string().required(),
                price:joi.number().required().min(0),
                //image:joi.string().required(),
                location:joi.string().required(),
                description:joi.string().required()
            }).required(),
            deleteImages: joi.array()
        });

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5).required(),
        body:joi.string().required(),
    }).required()
});