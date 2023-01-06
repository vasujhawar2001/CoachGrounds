const joi = require('joi')

module.exports.coachgroundSchema = joi.object({
            coachground: joi.object({
                title: joi.string().required(),
                price:joi.number().required().min(0),
                image:joi.string().required(),
                location:joi.string().required(),
                description:joi.string().required()
            }).required()
        });
