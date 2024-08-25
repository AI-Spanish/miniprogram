import {request, uploadFile} from '../api/request';

/**
 * 
 * @param {string} waveLocalUri 
 * @return Promise<String>
 */
export function getWaveResult(waveLocalUri) {
    return uploadFile(
				waveLocalUri,
        'mp3',
        '/upload/mp3', 
        {}
    );
}

/**
 * 使用音频上传，获取Ai响应信息。该接口一般配合MP3上传使用。
 * @param {String} imgUlr 需要识别的语音的公网地址（需要事先上传）
 * @return Promise<AiEchoInfo>
 * 
 */
export function getAiEchoByMP3(mp3Url) {
	return request({
		url: '/mp3',
		method: 'GET',
		data: {
			url: mp3Url,
		}
	});
}

/**
 * 
 * @param {string} msg 
 */
export function getAiEchoByMsg(msg) {
	return request({
		url: '/tts',
		method: 'GET',
		data: {
			msg: msg,
		}
	});
}

/**
 * 
 * @param {string} msg 
 */
export function postChatMsgToAi(msg) {
	return request({
		url: '/chat',
		method: 'GET',
		data: {
			msg: msg
		}
	});
}
