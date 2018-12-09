const messageModel = require('../models/messages');
const userModel = require('../models/users');
const APIError = require('../rest').APIError;

module.exports = {
    'POST /register': async (ctx, next) => {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        ctx.rest(await userModel.register(username, password));
    },
    'POST /login': async (ctx, next) => {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        ctx.rest(await userModel.login(username, password), username);
    },
    'POST /logout': async (ctx, next) => {
        let username = ctx.request.body.username;
        ctx.rest(await userModel.logout(username));
    },
    'POST /islogged': async (ctx, next) => {
        let username = ctx.request.body.username;
        ctx.rest(await userModel.isLoggedRest(username));
    },
    'GET /msg_list': async (ctx, next) => {
        let username = ctx.request.query.username;
        console.log("test" + username);
        ctx.rest(await messageModel.messageList(username));
    },
    'POST /send_msg': async (ctx, next) => {
        let from = ctx.request.body.from;
        let to = ctx.request.body.to;
        let title = ctx.request.body.title;
        let content = ctx.request.body.content;
        ctx.rest(await messageModel.sendMessage(from, to, title, content));
    },
    'POST /set_score': async (ctx, next) => {
        let username = ctx.request.body.username;
        let score = parseFloat(ctx.request.body.score);
        ctx.rest(await userModel.set_score(username, score));
    },
    'POST /get_score': async (ctx, next) => {
        let username = ctx.request.body.username;
        ctx.rest(await userModel.get_score(username));
    },
};
