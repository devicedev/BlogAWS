require("module-alias/register");

const faker = require("faker");

const uuidv4 = require("uuid/v4");

const {
    post: { createPost, updatePost, deletePost }
} = require("@usecases");

const {
    post: { makeTestCreatePostData },
    user: { makeTestMeUserData }
} = require("@tests/data");

const { assertField } = require("@tests/utils/assertions");

const {
    post: { assertValidUpdatePostData }
} = require("@tests/assertions");

describe("=== Post Usecases ===", () => {
    describe("Create", () => {
        const creationPostData = makeTestCreatePostData();

        const authUser = makeTestMeUserData();

        it("Should call dependencies correctly", async () => {
            const dependencies = makeDependencies();

            await createPost({ ...dependencies })(authUser, creationPostData);

            expect(dependencies.savePostCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    savePostCalled: true,
                    savePost: async () => {
                        dependencies.savePostCalled = true;
                        return Promise.resolve();
                    }
                };
                return dependencies;
            }
        });

        it("Should create a valid post", async () => {
            const dependencies = makeDependencies();

            const postData = await createPost({ ...dependencies })(
                authUser,
                creationPostData
            );

            expect(postData).toBeTruthy();

            assertField(postData.userId, authUser.id);

            function makeDependencies() {
                return {
                    savePost: async () => Promise.resolve()
                };
            }
        });
    });

    describe("Update", () => {
        const authUser = makeTestMeUserData();

        it("Should call dependencies correctly", async () => {
            const dependencies = makeDependencies();

            const updatePostData = Object.freeze({
                userId: authUser.id
            });

            await updatePost({ ...dependencies })(authUser, updatePostData);

            expect(dependencies.retrievePostCalled).toBe(true);

            expect(dependencies.savePostCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    retrievePostCalled: false,
                    retrievePost: async (userId, id) => {
                        dependencies.retrievePostCalled = true;
                        return Promise.resolve(
                            Object.freeze({
                                id,
                                userId
                            })
                        );
                    },
                    savePostCalled: false,
                    savePost: async () => {
                        if (!dependencies.retrievePostCalled)
                            throw new Error(
                                "Should have called retrievePost first"
                            );
                        dependencies.savePostCalled = true;
                    }
                };
                return dependencies;
            }
        });
        it("Should update the given post", async () => {
            const dependencies = makeDependencies();

            const updatePostData = Object.freeze({
                id: uuidv4(),
                updateFields: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraph(),
                    draft: faker.random.boolean()
                }
            });

            const postData = await updatePost({ ...dependencies })(
                authUser,
                updatePostData
            );

            assertValidUpdatePostData(updatePostData.updateFields, postData);

            function makeDependencies() {
                return {
                    retrievePost: async (userId, id) =>
                        Promise.resolve(Object.freeze({ userId, id })),
                    savePost: async () => Promise.resolve()
                };
            }
        });
        it("Should throw an error if the post is not found", async () => {
            const dependencies = makeDependencies();

            const updatePostData = Object.freeze({
                id: uuidv4()
            });
            try {
                await updatePost({ ...dependencies })(authUser, updatePostData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "PostNotFoundException");
            }

            function makeDependencies() {
                return {
                    retrievePost: async (userId, id) => Promise.resolve(null),
                    savePost: async () => Promise.resolve()
                };
            }
        });
        it("Should throw an error if the given post does not belong to the given user", async () => {
            const dependencies = makeDependencies();

            const updatePostData = {
                userId: uuidv4()
            };

            try {
                await updatePost({ ...dependencies })(authUser, updatePostData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "UserHasNoAccessToPostException");
            }

            function makeDependencies() {
                return {
                    retrievePost: async (userId, id) =>
                        Promise.resolve(
                            Object.freeze({ id, userId: uuidv4() })
                        ),
                    savePost: async () => Promise.resolve()
                };
            }
        });
    });
    describe("Delete", () => {
        const authUser = makeTestMeUserData();

        it("Should delete the given post", async () => {
            const dependencies = makeDependencies();

            const postData = Object.freeze({
                userId: authUser.id
            });

            await deletePost({ ...dependencies })(authUser, postData);

            expect(dependencies.removePostCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    retrievePost: async (userId, id) =>
                        Promise.resolve(
                            Object.freeze({
                                userId,
                                id
                            })
                        ),
                    removePostCalled: false,
                    removePost: async () => {
                        dependencies.removePostCalled = true;
                        return Promise.resolve();
                    }
                };
                return dependencies;
            }
        });
        it("Should call dependencies correctly", async () => {
            const dependencies = makeDependencies();

            const postData = Object.freeze({
                userId: authUser.id
            });

            await deletePost({ ...dependencies })(authUser, postData);

            expect(dependencies.retrievePostCalled).toBe(true);

            expect(dependencies.removePostCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    retrievePostCalled: false,
                    retrievePost: async (userId, id) => {
                        dependencies.retrievePostCalled = true;
                        return Promise.resolve(
                            Object.freeze({
                                userId,
                                id
                            })
                        );
                    },
                    removePostCalled: false,
                    removePost: async () => {
                        if (!dependencies.retrievePostCalled)
                            throw new Error(
                                "Should have called retrievePost first"
                            );
                        dependencies.removePostCalled = true;
                        return Promise.resolve();
                    }
                };
                return dependencies;
            }
        });

        it("Should throw an error if the given post is not found", async () => {
            const dependencies = makeDependencies();

            const postData = Object.freeze({});

            try {
                await deletePost({ ...dependencies })(authUser, postData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "PostNotFoundException");
            }

            function makeDependencies() {
                return {
                    retrievePost: async () => Promise.resolve(),
                    savePost: async () => Promise.resolve()
                };
            }
        });
        it("Should throw an error if the given post does not belong to the given user", async () => {
            const dependencies = makeDependencies();

            const postData = Object.freeze({
                id: uuidv4(),
                userId: uuidv4()
            });

            try {
                await deletePost({ ...dependencies })(authUser, postData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "UserHasNoAccessToPostException");
            }

            function makeDependencies() {
                return {
                    retrievePost: async (userId, id) =>
                        Promise.resolve(
                            Object.freeze({ id, userId: uuidv4() })
                        ),
                    savePost: async () => Promise.resolve()
                };
            }
        });
    });
});
