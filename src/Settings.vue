<script setup lang="ts">
import {Ref, ref} from "vue";

const version = "2.0";

interface User {
  uid: number;
  name: string;
  description: string;
  avatar: string;
}

let user: Ref<User> = ref(JSON.parse(localStorage["userInfo"] ||
    '{"uid":100000000,"name":"未登录！","description":"未登录！","avatar":"/icon/avatar/1001.png"}'));
let state = ref("");

function redirect(loc: string) {
  location.href = loc;
}

function updateUid() {
  state.value = "登录中，请稍后……";
  fetch(`http://localhost:7841/sr_info_parsed/${user.value.uid}`, {method: "GET", mode: 'cors'})
      .then(response => response.json())
      .then(data => {
        user.value.avatar = data.player.avatar.icon;
        user.value.name = data.player.nickname;
        user.value.description = data.player.signature;
        localStorage["userInfo"] = JSON.stringify(user.value);
        state.value = "";
      });
}

</script>

<template>
  <div class="appBox">
    <div class="titleBox">
      <h1>SRHelper</h1>
    </div>
    <div class="box accountBox">
      <img class="avatarImg" alt="头像" :src="'/srres/'+user.avatar"/>
      <div class="basicInfoBox">
        第一次使用请在下方输入UID以登录，或通过修改UID以切换账户
        <br/>
        {{ state }}
        <br/>
        UID:
        <input type="number" id="uid" v-model.number.lazy="user.uid" @change="updateUid()"/>
        <br/>
        名称: {{ user.name }}
        <br/><br/>
        <span @click="redirect('/index.html')">点击返回主页</span>
      </div>
      <p class="descriptionText">
        {{ user.description }}
      </p>
    </div>
    <div class="box infoBox">
      <p class="infoText">
        当前SRHelper适配游戏版本：{{ version }}
      </p>
    </div>
    <div class="box supportBox">
      <p>
        帮帮我！金主先生！
        <br/>
        前往<a href="https://afdian.net/a/yuyanMC">爱发电</a>支持我的创作！
      </p>
    </div>
  </div>
</template>

<style scoped>
.appBox {
  background-color: #224;
  width: 100%;
  height: 100%;
  --margin: 25px;
}

.appBox {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 20% 1fr 1fr;
  gap: 0 0;
  grid-auto-flow: row;
  grid-template-areas:
    "titleBox titleBox"
    "accountBox infoBox"
    "accountBox supportBox";
}

.titleBox {
  grid-area: titleBox;
}

.accountBox {
  grid-area: accountBox;
}

.infoBox {
  grid-area: infoBox;
}

.supportBox {
  grid-area: supportBox;
}

.accountBox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-auto-columns: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "avatarImg avatarImg"
    "basicInfoBox descriptionText"
    "basicInfoBox descriptionText";
}

.avatarImg {
  margin: 10px auto;
  height: calc(100% - 20px);
  grid-area: avatarImg;
  text-align: center;
}

.basicInfoBox {
  grid-area: basicInfoBox;
  text-align: left;
  margin: 20px;
}

.descriptionText {
  grid-area: descriptionText;
  text-align: left;
  margin: 20px;
}

.titleBox > h1 {
  margin: 0;
  position: absolute;
  top: calc(10% - 0.5em);
  width: 100%;
  font-size: 40px;
}
</style>
