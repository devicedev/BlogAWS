require("module-alias/register");

const faker = require("faker");

const {
    user: { register, login }
} = require("@usecases");

const getAuthUser = require("@utils/getAuthUser");

const {
    user: {
        makeTestCreateUserData,
        makeTestLoginUserData,
        makeTestAuthHeader,
        makeTestMeUserData
    }
} = require("@tests/data");

const { assertField } = require("@tests/utils/assertions");

describe("=== User Usecases ===", () => {
    describe("Register", () => {
        it("should throw an error if an user with the same email already exists", async () => {
            const creationUserData = makeTestCreateUserData();

            const dependencies = makeDependencies();

            try {
                await register({ ...dependencies })(creationUserData);

                throw new Error("Should have thrown an Error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "UserAlreadyExistsException");
            }

            function makeDependencies() {
                return {
                    retrieveAllUsers: async () =>
                        Promise.resolve([
                            {
                                email: creationUserData.email
                            }
                        ])
                };
            }
        });

        it("should call the dependencies correctly", async () => {
            const creationUserData = makeTestCreateUserData();

            const dependencies = makeDependencies();

            await register({ ...dependencies })(creationUserData);

            expect(dependencies.retrieveAllUsersCalled).toBe(true);

            expect(dependencies.saveUserCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    retrieveAllUsersCalled: false,
                    retrieveAllUsers: async () => {
                        dependencies.retrieveAllUsersCalled = true;

                        return Promise.resolve([]);
                    },
                    saveUserCalled: false,
                    saveUser: async () => {
                        if (!dependencies.retrieveAllUsersCalled)
                            throw new Error(
                                "Should have called retrieveAllUsers first"
                            );

                        dependencies.saveUserCalled = true;
                    }
                };
                return dependencies;
            }
        });
    });
    describe("Login", () => {
        it("should throw an error if the user with the given email address does not exist", async () => {
            const dependencies = makeDependencies();

            const loginUserData = makeTestLoginUserData();

            try {
                await login({ ...dependencies })(loginUserData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "InvalidEmailOrPassword");
            }

            function makeDependencies() {
                return {
                    retrieveAllUsers: async () =>
                        Promise.resolve([
                            {
                                email: faker.internet.exampleEmail(),
                                password: faker.lorem.word()
                            }
                        ])
                };
            }
        });

        it("should throw an error if an user with the given password does not exist", async () => {
            const dependencies = makeDependencies();

            const loginUserData = makeTestLoginUserData();

            try {
                await login({ ...dependencies })(loginUserData);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "InvalidEmailOrPassword");
            }

            function makeDependencies() {
                return {
                    retrieveAllUsers: async () =>
                        Promise.resolve([
                            {
                                email: loginUserData.email,
                                password: faker.lorem.word()
                            }
                        ])
                };
            }
        });
    });
    describe("Me", () => {
        function makeDependencies(user = makeTestMeUserData) {
            return {
                retrieveUser: async () => Promise.resolve(user)
            };
        }

        it("should call dependencies correctly", async () => {
            const dependencies = makeDependencies();

            const headers = makeTestAuthHeader();

            await getAuthUser({ ...dependencies })(headers);

            expect(dependencies.retrieveUserCalled).toBe(true);

            function makeDependencies() {
                const dependencies = {
                    retrieveUserCalled: false,
                    retrieveUser: async () => {
                        dependencies.retrieveUserCalled = true;
                        return Promise.resolve(makeTestMeUserData);
                    }
                };
                return dependencies;
            }
        });

        it("Should throw an error if the auth token is not provided", async () => {
            const dependencies = makeDependencies();

            const headers = {};

            try {
                await getAuthUser({ ...dependencies })(headers);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "NoJWTException");
            }
        });

        it("Should throw an error if the given auth token is not valid", async () => {
            const dependencies = makeDependencies();

            const headers = {
                "x-auth": "1"
            };

            try {
                await getAuthUser({ ...dependencies })(headers);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "InvalidJWTException");
            }
        });

        it("Should throw an error if the user is not found in the database", async () => {
            const dependencies = makeDependencies();

            const headers = makeTestAuthHeader();

            try {
                await getAuthUser({ ...dependencies })(headers);

                throw new Error("Should have thrown an error");
            } catch (err) {
                expect(err).toBeTruthy();

                assertField(err.code, "InvalidJWTException");
            }

            function makeDependencies() {
                return {
                    retrieveUser: async () => Promise.resolve(null)
                };
            }
        });

        it("Should return the user from the token", async () => {
            const userData = makeTestMeUserData();

            const dependencies = makeDependencies(userData);

            const headers = makeTestAuthHeader(userData);

            const result = await getAuthUser({ ...dependencies })(headers);

            expect(result).toBeTruthy();

            assertField(result.id,userData.id);
        });
    });
});
