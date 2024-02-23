<script setup lang="ts">

import {ref, Ref} from "vue";
import {getUpdateTime, getUser, updateInfo, User, getCharacters} from "./mihomo.ts";

function redirect(loc: string) {
  location.href = loc;
}

let user: Ref<User> = ref(getUser());
let characters = ref(getCharacters());

async function updateData() {
  user.value = await updateInfo(user.value.uid);
  characters.value = getCharacters();
}

</script>

<template>
  <div class="appBox">
    <div class="titleBox">
      <h1>SRHelper</h1>
    </div>
    <div class="box infoBox">
      <img class="avatarImg" alt="头像" :src="'/srres/'+user.avatar"/>
      <p class="infoText">
        {{ user.name }}
        <br/>
        {{ user.description }}
        <br/>
        <span @click="updateData()">
          点击刷新数据
          <br/>
          上次更新于：{{ new Date(getUpdateTime(user.uid)).toLocaleString() }}
        </span>
      </p>
    </div>
    <div class="box charBox">
      <div class="cButton singleCharBox" v-for="i in getCharacters()"
           @click="redirect('/singlecharacter.html?id='+i.id)">
        <img class="charImg" alt="头像" :src="'/srres/'+i.icon"/>
        <span class="charName">{{ i.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appBox {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 20% 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "titleBox titleBox"
    "infoBox charBox";
}

.titleBox {
  grid-area: titleBox;
}

.infoBox {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 2fr;
  gap: 0px 0px;
  grid-template-areas:
    "avatarImg"
    "infoText";
  grid-area: infoBox;
}

.avatarImg {
  margin: 10px auto;
  height: calc(100% - 20px);
  grid-area: avatarImg;
  text-align: center;
}

.infoText {
  grid-area: infoText;
}

.charBox {
  grid-area: charBox;
  display: flex;
  flex-flow: row wrap;
}

.appBox {
  background-color: #224;
  width: 100%;
  height: 100%;
  --margin: 25px;
}

.titleBox > h1 {
  margin: 0;
  position: absolute;
  top: calc(10% - 0.5em);
  width: 100%;
  font-size: 40px;
}

.singleCharBox {
  display: flex;
  flex-flow: column wrap;
  height: 150px;
  width: 120px;
}

.charImg {
  margin: 10px;
  height: 100px;
  grid-area: avatarImg;
  text-align: center;
}

.charName {
  font-size: 20px;
}
</style>