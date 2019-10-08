require("module-alias/register");

const {
    factory: { create }
} = require("@user");

const {
    user: { makeTestCreateUserData }
} = require("@tests/data");

const {
    user: { assertValidUserData }
} = require("@tests/assertions");

describe("=== User Entity ===", () => {
    describe("factory", () => {
        describe("create", () => {
            it("should throw exception if the user fields are not valid", async () => {
                try {
                    const creationData = {};

                    await create(creationData);

                    throw new Error("Should have thrown an error");
                } catch (err) {
                    expect(err).toBeTruthy();

                    expect(err.code).toBeTruthy();

                    expect(err.code).toStrictEqual("UserValidationException");
                }
            });
            it("should create valid user data", async () => {
                const creationUserData = makeTestCreateUserData();

                const userData = await create(creationUserData);

                assertValidUserData(creationUserData, userData);
            });
        });
    });
});
