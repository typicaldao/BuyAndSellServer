const Sequelize = require('sequelize');
const config = require('../config');
const responses = require('../utils/response').responses;
const expire_time = require('../utils/response').expire_time;
const userModel = require('../models/users');
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

function sortByTime(a, b){
    return b.time - a.time;
}

function Message(id, from, to, time, title, content) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.time = time;
    this.title = title;
    this.content = content;
}
var MessageTable = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    from: Sequelize.STRING(255),
    to: Sequelize.STRING(255),
    time: Sequelize.DATE,
    title: Sequelize.STRING(255),
    content: Sequelize.STRING(255)
}, {
    timestamps: false
});


module.exports = {
    messageList : async (from)=>{
        let isLogged = await userModel.isLogged(from);
        if (isLogged === false){
            return responses.notLogged;
        }
        let messages = await MessageTable.findAll({
            where:{
                from: from
            }
        });
        let message_result_list = [];
        for (let message of messages){
            message = message.toJSON();
            delete message.id;
            message_result_list.push(message)
        }
        message_result_list.sort(sortByTime);
        console.log(message_result_list);
        return {
            err: 0,
            info: message_result_list
        };
    },
    sendMessage: async (from, to, title, content) => {
        let isLogged = await userModel.isLogged(from);
        if (isLogged === false){
            return responses.notLogged;
        }
        let p = await MessageTable.create({
            from: from,
            to: to,
            time: new Date(),
            title: title,
            content: content
        });
        console.log('created.' + JSON.stringify(p));
        return responses.successResponse;
    },
};

