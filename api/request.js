import domain from '../config/host'

/**
 * 预处理请求参数
 * 1. 完善请求地址
 * 2. 添加请求 token
 * 
 * @param {String} params.url 请求 url
 * @param {String} params.method  请求方式
 * @param {Object} params.header 请求头
 */
function proProcessParams(params) {
	const {url, method, header, noToken} = params;

	if (/^\/\w.*/.test(url)){
		params.url = domain + url;
	} 

	if (/^(http:\/\/|https:\/\/)\w.*/.test(params)) {
		throw new Error('[url] '.concat(url).concat(' is not available!'))
	}
	console.log("params", params)

	if (!method) {
		params.method = 'GET';
	} else if (method.toLowerCase() === "post") {
		if (header) {
			if (!header['Content-Type']) {
				params.header['Content-Type'] = 'application/json';
			}
		} else {
			params.header = {
				'Content-Type': 'application/json'
			};
		}
	}

	if (!noToken) {
		addToken(params);
	}else {
        console.log("no token!")
		delete params['noToken'];
	}
}

function addToken(params) {
    let token = wx.getStorageSync('token');
    if (token) {
        params.header = params.header??{}
        params.header['token'] = token;

        /*if (!params.header) {
            params.header = {};
        }
        params.header['token'] = token;*/
    }
}



/**
 * 发起网络同步请求。会尝试对结果进行预处理。
 * - 处理的返回值格式 {code: 200, message: "请求成功", data: {}}
 * 
 * @param {String} params.url 请求地址。例：http(s)://www.myapp.com/user/login; /user/login
 * @param {Boolean} params.noToken 不添加 token ， 默认值 false
 */
export async function request(params) {
	return new Promise((resolve, reject) => {
		try {
			proProcessParams(params);
		} catch(err) {
			reject(err);
        }
        
		wx.request({
			...params,
			success: res => {
                //参见微信小程序文档https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
                const {statusCode,data} = res;  //解构响应包
				if (statusCode && statusCode == 200) {
					resolve(data);
				} else {
					reject(res);
				}
			},
            fail: reject,
            complete:()=>{
                console.log('request/' + Date.now())
            }
		})
	}); 
}


/**
 * 支持服务器端实现的流式响应（Server Side Event）
 * 需要在onChunk里实现对流式响应内容的解析
 * @param {} params URL等参数
 * @param {*} onHeaders 处理流式响应头的函数,(res)=>{} 格式
 * @param {*} onChunk 处理流式响应块的函数, (res)=>{} 格式
 */
export async function requestSSE(params, onHeaders, onChunk) {
    return new Promise((resolve, reject) => {
        try {
            proProcessParams(params);
        } catch (err) {
            reject(err);
        }

        const requestTask = wx.request({
            ...params,
            enableChunked: true, //接收流式响应
            timeout: 15000, //流式结束时间
            responseType: "text", //responseType: "arraybuffer",
            success: res => {
                const {
                    statusCode,
                    data
                } = res;
                if (statusCode && statusCode == 200) {
                    resolve(data);
                    requestTask.onHeadersReceived(onHeaders);
                    requestTask.onChunkReceived(onChunk);
                } else {
                    reject(res);
                }
            },
            fail: reject,
            complete: () => {
                console.log('requestSSE/' + Date.now())
            }
        })
    });
}


/**
 * 
 * @param {*} fileLocalUri 要上传文件资源的路径 (wx.chooseMedia返回的)
 * @param {*} keyname 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {*} remotePath 开发者服务器地址
 * @param {*} data 想要传输的其它form参数，json格式
 */
export function uploadFile(fileLocalUri, keyname, remotePath,data) {
    var excutor = (resolve, reject) => {
        wx.uploadFile({
            filePath: fileLocalUri,
            name: keyname,
            url: domain + remotePath,
            header: {
                "Content-Type": "multipart/form-data",
                "token": wx.getStorageSync('token')
            },
            method: 'post',
            formData: {
                ...data
                //Creater: Creater,
                //FileName: FileName,
            }, //需要传的参数
            success(res) {
                resolve(res.data)
            },
            catch(err){
                reject(err)
            }
        })
    }
    return new Promise(excutor); 
}
