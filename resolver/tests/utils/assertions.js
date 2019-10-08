const bcryptjs = require("bcryptjs");

module.exports = {
    assertId,
    assertField,
    assertPassword,
    assertDate
};

function assertId(id) {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(id).toBeTruthy();

    expect(id).toMatch(UUID_REGEX);
}

function assertField(field, value) {
    expect(field).toBeTruthy();

    expect(field).toStrictEqual(value);
}
function assertPassword(password, hash) {
    expect(hash).toBeTruthy();

    expect(bcryptjs.compareSync(password, hash)).toBe(true);
}
function assertDate(date) {
    expect(date).toBeTruthy();

    expect(Date.parse(date)).toBe(NaN);
}
