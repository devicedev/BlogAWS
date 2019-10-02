const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const PasswordComplexity = require('joi-password-complexity');

const {MissingRequiredFieldException} = require('@exceptions');

const {UserData} = require('./data');

module.exports = {
    create
};

const create = async (creationData) => {

    const result = validate();

    if (result.error) {
        throw MissingRequiredFieldException();
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
            return {
                name: Joi.string().min(1).max(255).required(),
                email: Joi.string().email().required(),
                password: new PasswordComplexity({
                    min: 8,
                    max: 26,
                    lowerCase: 1,
                    upperCase: 1,
                    numeric: 1,
                    symbol: 0,
                    requirementCount: 3,
                }),
            };

        }
    }

};