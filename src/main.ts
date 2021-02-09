import * as https from "https";
import {IncomingMessage} from "http";
import * as querystring from "querystring";
import md5 = require("md5");
import {appId, key} from "../secret/secret";

type baiDuObject = {
    from: string,
    to: string,
    error_code?: string,
    trans_result: {
        src: string,
        dst: string
    }[],
    error_msg?: string
}

export const translate = (word: string) => {
    const salt = Math.floor(100000 + Math.random() * 900000);
    const sign = md5(appId + word + salt + key);
    let from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        // 英译中
        from = "en";
        to = "zh";
    } else {
        // 中译英
        from = "zh";
        to = "en";
    }

    const query: string = querystring.stringify({
        from, to, salt, sign,
        q: word,
        appid: appId
    });

    const options = {
        hostname: "fanyi-api.baidu.com",
        port: 443,
        path: "/api/trans/vip/translate" + "?" + query,
        method: "GET",
    };


    const request = https.request(options, (response: IncomingMessage) => {
        let chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });
        response.on("end", () => {
            const string = Buffer.concat(chunks).toString();
            const object: baiDuObject = JSON.parse(string);
            if (object.error_code) {
                console.log(object.error_msg);
                process.exit(2);
            } else {
                console.log(object.trans_result[0].dst);
                process.exit(0);
            }
        });
    });

    request.on("error", (e) => {
        console.error(e);
    });
    request.end();
};
