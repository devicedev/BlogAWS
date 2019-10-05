const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const {UserValidationException} = require('@exceptions');

const {UserData} = require('./data');

module.exports = {
    create
};

async function create(creationData) {
    const result = validate();

    console.log(result.error);

    if (result.error) {
        throw UserValidationException(result.error.message);
    }

    const data = {
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...creationData
    };

    const salt = await bcrypt.genSalt(10);

    data.password = await bcrypt.hash(data.password, salt);

    return UserData(data);

    function validate() {
        const schema = makeValidationSchema();

        return schema.validate(creationData);

        function makeValidationSchema() {
            return Joi.object().keys({
                name: Joi.string().min(1).max(255).required(),
                email: Joi.string().email().required(),
                password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required(),
            });
        }
    }
}