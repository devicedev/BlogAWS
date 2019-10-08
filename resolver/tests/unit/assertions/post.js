module.exports = {
    assertValidPostData,
    assertValidUpdatePostData
};

const {
    assertId,
    assertField,
    assertDate
} = require("@tests/utils/assertions");

function assertValidPostData(creationPostData, postData) {
    expect(postData).toBeTruthy();

    expect(creationPostData).toBeTruthy();

    assertId(postData.id);

    assertField(postData.title, creationPostData.title);

    assertField(postData.content, creationPostData.content);

    expect(postData.draft).toBe(creationPostData.draft);

    assertDate(postData.createdAt, creationPostData.createdAt);

    assertDate(postData.updatedAt, creationPostData.updatedAt);
}

function assertValidUpdatePostData(updatePostData, postData) {
    expect(postData).toBeTruthy();

    expect(updatePostData).toBeTruthy();

    assertField(postData.title, updatePostData.title);

    assertField(postData.content, updatePostData.content);

    expect(postData.draft).toBe(updatePostData.draft);
}