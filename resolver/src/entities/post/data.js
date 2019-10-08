module.exports = { PostData };

function PostData({ id, title, content, userId, draft, createdAt, updatedAt }) {
    return Object.freeze({
        id,
        title,
        content,
        userId,
        draft,
        createdAt,
        updatedAt
    });
}
