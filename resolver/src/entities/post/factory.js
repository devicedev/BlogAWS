const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');

const {
    PostsValidationException
} = require('@exceptions');

const {
    PostData
} = require('./data');

module.exports = {
    create
};


async function create(data) {

    const result = validate();

    if (result.error) {
        throw PostsValidationException();
    }
    const post = {
        id: uuidv4(),
        createdAt: Date.now(),
        updateAt: Date.now(),
        ...data
    };

    return PostData(post);


    function validate() {

        const schema = makeValidationSchema();

        return schema.validate();

        function makeValidationSchema() {
            return Joi.object({
                title: Joi.string().min(1).max(255).required(),
                content: Joi.string().min(1).max(65500).required(),
                draft: Joi.boolean().required()
            });
        }

    }
}