module.exports = {
    UserData
};

function UserData({ id, name, email, password, createdAt, updatedAt }) {
    return Object.freeze({
        id,
        name,
        email,
        password,
        createdAt,
        updatedAt
    });
}
