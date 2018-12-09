const responses = {
    unknownFailure: {err:-1, info: "Unknown Failure"},
    successResponse: {err: 0, info: "Success Response"},
    invalidUserName:{err:1, info:"Invalid User Name"},
    invalidPassword: {err: 2, info: "Invalid Password"},
    invalidScore: {err: 3, info: "Invalid Score"},
    notLogged: {err: 4, info: "You are not logged"},
};
const expire_time = 12000000;
module.exports = {responses: responses, expire_time:expire_time};
