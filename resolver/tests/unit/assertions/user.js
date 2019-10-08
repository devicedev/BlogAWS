module.exports = {
    assertValidUserData
};

const {
    assertId,
    assertField,
    assertPassword,
    assertDate
} = require("@tests/utils/assertions");

function assertValidUserData(userCreationData, userData) {
    expect(userData).toBeTruthy();

    expect(userCreationData).toBeTruthy();

    assertId(userData.id);

    assertField(userData.name, userCreationData.name);

    assertField(userData.email, userCreationData.email);

    assertPassword(userCreationData.password, userData.password);

    assertDate(userData.createdAt);

    assertDate(userData.updatedAt);
}