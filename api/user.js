/**
 * 20240806 by zhangzhengye
 * 本文件来自其他项目，示例如何通过微信登陆到后台微服务。需要后台编写微服务代码的配合
 */

import {
	request
} from '../api/request';

// 仅演示调用格式
/**
 *  用户登录接口。调用 `wx.login()` 获取用户授权码，使用授权码进行登录。
 * @return Promise
 */
export function login() {
	return new Promise(async (resolve, reject) => {
		let wxLoginRes = await wx.login().catch(err => reject(err));
		if (wxLoginRes) {
			let response = await request({
				noToken: true,
				url: '/user/login-wx',   //这里修改为咱们自己的微服务地址
				method: "POST",
				data: {
					code: wxLoginRes.code
				}
			}).catch(err => reject(err));
			if (response) {
				resolve(response);
			}
		}
	});
}

// 仅演示调用格式
export function showInviteDetails() {
	return request({
		url: '/invite/list',
		data: {}
	});
}

// 仅演示调用格式
export function showBoundDetails() {
	return request({
		url: '/sales/list',
		data: {}
	});
}

// 仅演示调用格式
/**
 * 绑定酒店
 * @param {Stirng} code  商家邀请码
 */
export function acceptInvitation(yqm) {
	return request({
		url: '/invite/accept',
		method: 'POST',
		data: {
			yqm: yqm
		}
	});
}

