import {ref, Ref} from "vue";

interface User {
    uid: number;
    name: string;
    description: string;
    avatar: string;
}

enum LoginState {
    NoAccount,
    Outdated,
    UpToDate,
    Invalid
}

let rawCache = JSON.parse(localStorage["rawCache"] || "{\"time\":{}}");

async function updateInfo(uid: number = getUser().uid) {
    let user: User = {avatar: "", description: "", name: "", uid: 100000000};

    return fetch(`http://localhost:7841/sr_info_parsed/${uid}`, {method: "GET", mode: 'cors'})
        .then(response => response.json())
        .then(data => {
            rawCache[uid] = data;
            rawCache.time[uid] = Date.now();
            localStorage["rawCache"] = JSON.stringify(rawCache);
            user.uid = uid;
            user.avatar = data.player.avatar.icon;
            user.name = data.player.nickname;
            user.description = data.player.signature;
            localStorage["userInfo"] = JSON.stringify(user);
            return user;
        })
        .catch(reason => {
            alert("请您正确搭建反代服务器！");
            return user;
        });
}

function getUpdateTime(uid: number) {
    return rawCache.time[uid] || 0;
}

function getUser(): User {
    return JSON.parse(localStorage["userInfo"] ||
        '{"uid":100000000,"name":"未登录！","description":"未登录！","avatar":"/icon/avatar/1001.png"}');
}

function getLoginState(): LoginState {
    if (localStorage["userInfo"]) {
        return LoginState.UpToDate;
    }
    return LoginState.Invalid;
}

function getCharacters() {
    return rawCache[getUser().uid]["characters"];
}

export type {User};
export {getUser, getLoginState, updateInfo, LoginState, getUpdateTime, getCharacters};