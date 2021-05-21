import jsonP from 'jsonp'

class JsonpApi{
    static jsonp(options){
        return new Promise((resolve, reject) =>{
            jsonP(options.url,{
                 // jsonp的原理是什么？
                // 用于指定回调的查询字符串参数的名称
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response)
                } else {
                    reject(response.message);
                }
            })
        })
    }
    // static go() {
    //     console.log(" gon ");
    // }
}

export default JsonpApi
