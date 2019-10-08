require("module-alias/register");

const {
    factory: { create },
    behaviour: { update }
} = require("@post");

const {
    post: { assertValidPostData }
} = require("@tests/assertions");

const {
    post: { makeTestCreatePostData }
} = require("@tests/data");

describe("=== Post Entity ===", () => {
    describe("factory", () => {
        describe("create", () => {
            it("should throw an error if the post fields are not valid", async () => {
                try {
                    const creationData = {};

                    await create(creationData);

                    throw new Error("Should have thrown an error");
                } catch (err) {
                    expect(err).toBeTruthy();

                    expect(err.code).toBeTruthy();

                    expect(err.code).toStrictEqual("PostValidationException");
                }
            });
            it("should create valid post data", async () => {
                const creationPostData = makeTestCreatePostData();

                const postData = create(creationPostData);

                assertValidPostData(creationPostData, postData);
            });
        });
        describe("update", () => {
            it("Should throw an error if the post fields are not valid", async () => {
                try {
                    const updatePostData = {};

                    const updateFields = {};

                    update(updatePostData, updateFields);

                    throw new Error("Should have thrown an error");
                } catch (err) {
                    expect(err).toBeTruthy();

                    expect(err.code).toBeTruthy();

                    expect(err.code).toStrictEqual("PostValidationException");
                }
            });
        });
    });
});
