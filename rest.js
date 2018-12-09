const expire_time = require('./utils/response').expire_time;
module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process REST API ${ctx.request.method} ${ctx.request.url}...`);
                if (ctx.request.path.search("login") !== -1){
                    ctx.rest = (data, username) => {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
                        ctx.cookies.set(
                            'username', username,{
                                domain:'localhost', // 写cookie所在的域名
                                path:'/',       // 写cookie所在的路径
                                maxAge: 2*60*60*1000,   // cookie有效时长
                                expires:new Date() + expire_time, // cookie失效时间
                                httpOnly:false,  // 是否只用于http请求中获取
                                overwrite:false  // 是否允许重写
                            }
                        );
                    };


                }else{
                    ctx.rest = (data) => {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
                    };
                }

                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        err: e.code || -1,
                        message: e.message || 'internal:unknown_error'
                    };
                }
            } else {
                await next();
            }
        };
    }
};
