/**
 * 20240806 by zhangzhengye
 * 本文件来自其他项目，示例如何通过微信登陆到后台微服务。需要后台编写微服务代码的配合
 */

import {request, uploadFile} from '../api/request';

export function getJdbOcrResult(imageLocalUri) {
    return uploadFile(
        imageLocalUri,
        'img',
        '/orders/ocr/raw', 
        {}
    );
}

/**
 * 使用 OCR 文字识别，获取订单信息。该接口一般配合图片上传使用。
 * @param {String} imgUlr 需要识别的图片的公网地址
 * @return Promise<OrderInfo>
 * 
 */
export function getOrderByOcr(imgUlr) {
	return request({
		url: '/ocr/order',
		method: 'GET',
		data: {
			url: imgUlr,
		}
	});
}

//添加订单
export function add(jms,fwq,orderInfo) {
	return request({
        method: "POST",
        url: '/orders/add',
        header:{
            jms:jms,
            fwq:fwq
        },
        data: {
            ...orderInfo
        }
	});
}

//撤销订单
export function retract(id) {
	return request({
        method: "PUT",
        url: '/orders/retract',
        header:{
            id:id
        }
	});
}

export function trace(id) {
	return request({
        method: "PUT",
        url: '/orders/trace',
        header:{
            id:id
        }
	});
}

/**
 *  提交订单
 * @param {String} orderInfo.name  预订人名称
 * @param {String} orderInfo.phone  预订人手机号
 * @params ...
 * 
 */
export function submitOrder(orderInfo) {
	return request({
		url: '/orders/submit',
		method: 'POST',
		data: {
			...orderInfo
		}
	});
}

export function list() {
	return request({
		url: '/orders/list',
	});
}

/**
 * 分页获取订单信息
 * 
 * @param {int} page 页码
 * @param {int} size 每页数据条数
 */
export function pageList(page, size) {
	return request({
		url: '/order/list-page',
		data: {
			page: page,
			size: size
		}
	});
}


