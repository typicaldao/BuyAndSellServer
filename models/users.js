const Sequelize = require('sequelize');
const config = require('../config');
const responses = require('../utils/response').responses;
const expire_time = require('../utils/response').expire_time;
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

function User(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
}

var UserTable = sequelize.define('user', {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true
    // },
    username: Sequelize.STRING(255),
    password: Sequelize.STRING(255),
    last_login_time: Sequelize.DATE,
    is_login: Sequelize.BOOLEAN,
    score: Sequelize.DOUBLE,
    score_number: Sequelize.INTEGER,
}, {
    timestamps: false
});

async function isLogged(username){
    let user = await UserTable.find({
        where:{
            username: username
        }
    });
    if (user.dataValues.is_login === false){
        return false;
    }
    if (new Date() - user.dataValues.last_login_time > expire_time){
        await UserTable.update({
            is_login: false
        }, {
            where:{
                username: username
            }
        });
        return false;
    }
    return true;
}

module.exports = {
    isLogged,
    isLoggedRest: async (username) => {
        let islogged = await isLogged(username);
        if(islogged === true){
            return responses.successResponse;
        }else{
            return responses.notLogged;
        }
    },
    register: async (username, password) => {
        let user = await UserTable.find({
            where:{
                username: username
            }
        });
        if (user !== null) {
            return responses.invalidUserName;
        }
        let p = await UserTable.create({
            username: username,
            password: password,
            last_login_time: new Date(),
            is_login: false,
            score: 0,
            score_number: 0,
        });
        console.log('created.' + JSON.stringify(p));
        return responses.successResponse;
    },
    login: async (username, password) => {
        let user = await UserTable.find({
            where:{
                username: username
            }
        });
        if (user === null){
            return responses.invalidUserName;
        }else{
            if (`${user.password}` === password){
                await UserTable.update({
                    last_login_time: new Date(),
                    is_login: true
                }, {
                    where:{
                        username: username
                    }
                });
                return responses.successResponse;
            }else{
                return responses.invalidPassword;
            }

        }
    },
    logout: async (username)=>{
        await UserTable.update({
            is_login: false
        }, {
            where:{
                username: username
            }
        });
        return responses.successResponse;
    },
    set_score: async (username, score)=>{
        if (score > 100){
            return responses.invalidScore;
        }
        let user = await UserTable.find({
            where:{
                username: username
            }
        });
        user.score = (user.score * user.score_number + score) / (user.score_number + 1)
        user.score_number ++;
        await user.save()
        return responses.successResponse;
    },
    get_score: async (username)=>{
        let user = await UserTable.find({
            where:{
                username: username
            }
        });
        return {
            username: username,
            score: `${user.score}`
        }
    }
};