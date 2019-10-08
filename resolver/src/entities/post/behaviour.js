const Joi = require("@hapi/joi");

const { PostData } = require("./data");

const { PostValidationException } = require("@exceptions");

module.exports = {
    update
};

function update(postData, updateFields) {
    const result = validate();

    if (result.error) throw PostValidationException(result.error.message);

    return PostData({
        ...postData,
        ...updateFields,
        updatedAt: Date.now()
    });

    function validate() {
        const schema = makeValidationSchema();

        return schema.validate(updateFields);

        function makeValidationSchema() {
            return Joi.object().keys({
                title: Joi.string()
                    .min(1)
                    .max(255)
                    .required(),
                content: Joi.string()
                    .min(1)
                    .max(65500)
                    .required(),
                draft: Joi.boolean().required()
            });
        }
    }
}
