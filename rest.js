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
                // todo: session and cookie
                if (ctx.request.path.search("login") !== -1){
                    ctx.rest = (data) => {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
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
