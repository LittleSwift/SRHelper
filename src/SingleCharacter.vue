<script setup lang="ts">
import {getCharacters} from "./mihomo.ts";
import Properties from "./assets/properties.json";
import Important from "./assets/important.json";


let id = /id=([^&#=]*)/.exec(window.location.search).pop();
let characterInfo: Character = getCharacters().find(obj => obj.id == id);

Important[characterInfo.id] = Important[characterInfo.id] ||
    {
      level: [130, 125, 120, 115, 90, 60, 40, 0],
      props: [
        ["atk", 0.01, 100000],
        ["crit_rate", 60, 1],
        ["crit_dmg", 30, 100000]
      ]
    };

function getAttribute(field: string) {
  return characterInfo.attributes.find(obj => obj.field == field) || {value: 0};
}

function getAddition(field: string) {
  return characterInfo.additions.find(obj => obj.field == field) || {value: 0};
}

function getAttributeName(field: string) {
  console.log(field);
  return Object.values(Properties).find(obj => obj.field == field).name;
}

function getTotalAttributeAmount(field: string) {
  return getAttribute(field).value + getAddition(field).value;
}

function getSkill(type: string) {
  return characterInfo.skills.find(obj => obj.type == type);
}

function getScore(i) {
  return Math.round((i[2] ? Math.min(getTotalAttributeAmount(i[0]), i[2]) : getTotalAttributeAmount(i[0])) * i[1] * 10) / 10
}

function getTotalScore() {
  return Important[characterInfo.id].props.map(obj => getScore(obj)).reduce((reduced, obj) => reduced + obj)
}

function getScoreLevel() {
  const levels = [
    ["ACE", "#f33"],
    ["SSS", "#c74"],
    ["SS", "#d93"],
    ["S", "#da3"],
    ["A", "#dd4"],
    ["B", "#3d4"],
    ["C", "#37d"],
    ["D", "#777"]
  ];
  return levels[Important[characterInfo.id].level.indexOf(Important[characterInfo.id].level.find(obj => getTotalScore() >= obj))];
}
</script>

<template>
  <div class="appBox">
    <div class="titleBox">
      <h1>SRHelper</h1>
    </div>
    <img :alt="characterInfo.name" class="charImg" :src="'/srres/'+characterInfo.portrait"/>
    <div class="box infoBox">
      <h2 style="margin:0;">
        <img :alt="characterInfo.path.name" class="icon" :src="'/srres/'+characterInfo.path.icon"/>
        <img :alt="characterInfo.element.name" class="icon" :src="'/srres/'+characterInfo.element.icon"/>
        {{ characterInfo.name }}
      </h2>
      <span>Lv{{ characterInfo.level }}</span>
      <br/>
      <img alt="生命值" class="icon" src="/srres/icon/property/IconMaxHP.png">
      <span>{{ Math.round(getAttribute("hp").value + getAddition("hp").value) }}&nbsp;</span>
      <img alt="攻击力" class="icon" src="/srres/icon/property/IconAttack.png">
      <span>{{ Math.round(getAttribute("atk").value + getAddition("atk").value) }}&nbsp;</span>
      <img alt="防御力" class="icon" src="/srres/icon/property/IconDefence.png">
      <span>{{ Math.round(getAttribute("def").value + getAddition("def").value) }}&nbsp;</span>
      <br/>
      <img alt="速度" class="icon" src="/srres/icon/property/IconSpeed.png">
      <span>{{ Math.round(getAttribute("spd").value + getAddition("spd").value) }}&nbsp;</span>
      <img alt="暴击率" class="icon" src="/srres/icon/property/IconCriticalChance.png">
      <span>{{
          Math.round((getAttribute("crit_rate").value + getAddition("crit_rate").value) * 1000) / 10
        }}%&nbsp;</span>
      <img alt="暴击伤害" class="icon" src="/srres/icon/property/IconCriticalDamage.png">
      <span>{{ Math.round((getAttribute("crit_dmg").value + getAddition("crit_dmg").value) * 1000) / 10 }}%&nbsp;</span>
      <br/>
      <div style="font-size: 2em;">
        <img v-for="i in [0,1,2,3,4,5]" :alt="'星魂'+(i+1)" :style="i>=characterInfo.rank?`filter: brightness(50%)`:''"
             class="icon" :src="'/srres/'+characterInfo.rank_icons[i]">
      </div>
      <div style="display: flex;">
        <img :alt="characterInfo.light_cone.name" class="icon4x" :src="'/srres/'+characterInfo.light_cone.icon">
        <div>
          <p style="font-size: 0.5em;">
            {{ characterInfo.light_cone.name }}
            <br/>
            叠影{{ characterInfo.light_cone.rank }}阶 Lv{{ characterInfo.light_cone.level }}
          </p>
        </div>
      </div>
    </div>
    <div class="box talentBox">
      <div v-for="i in ['Normal','BPSkill','Ultra','Talent','Maze']">
        <img :alt="getSkill(i).type_text" class="icon2x" :src="'/srres/'+getSkill(i).icon">
        <br/>
        <span style="font-size: 0.5em;position: relative;top:-2.5em;">{{ getSkill(i).type_text }}</span>
        <br/>
        <span style="font-size: 0.75em;position: relative;top:-2.5em;">{{ getSkill(i).level }}</span>
      </div>
      <div class="verticalSeparator"></div>
      <div style="vertical-align: top;">
        <div style="display: flex">
          <span style="font-size: 2em;">角色评分=</span>
          <template v-for="i in Important[characterInfo.id].props">
            <span style="font-size: 2em;" v-if="i!=Important[characterInfo.id].props[0]">+</span>
            <div class="cAttribute">
              <span>{{ getAttributeName(i[0]) }}</span>
              <br/>
              <span>{{ getScore(i) }}</span>
            </div>
          </template>
          <span style="font-size: 2em;">={{
              getTotalScore().toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })
            }}&nbsp;&nbsp;&nbsp;</span>
          <span
              :style="'font-size: 2em;color: '+getScoreLevel()[1]+';filter: drop-shadow(-0.1em 0.1em 0.1em);'">{{
              getScoreLevel()[0]
            }}</span>
        </div>
      </div>
    </div>
    <div class="box relicBox">
      <div class="cButton relicHead" v-for="pl in [0]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div>
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
      <div class="cButton relicHand" v-for="pl in [1]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div>
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
      <div class="cButton relicBody" v-for="pl in [2]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div style="font-size: 15px;">
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
      <div class="cButton relicFoot" v-for="pl in [3]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div>
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
      <div class="cButton relicNeck" v-for="pl in [5]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div>
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
      <div class="cButton relicObject" v-for="pl in [4]">
        <div>
          <img :alt="characterInfo.relics[pl].name" class="relicIcon" :src="'/srres/'+characterInfo.relics[pl].icon">
        </div>
        <div>
          <span>{{ characterInfo.relics[pl].name }} +{{ characterInfo.relics[pl].level }}</span>
          <br>
          <span>{{ characterInfo.relics[pl].main_affix.name }} {{ characterInfo.relics[pl].main_affix.display }}</span>
          <div style="font-size: 12px;" v-for="i in [...Array(characterInfo.relics[pl].sub_affix.length).keys()]">
            <span>{{ characterInfo.relics[pl].sub_affix[i].name }} {{
                characterInfo.relics[pl].sub_affix[i].display
              }}</span>
            <span style="float: right">(+{{ characterInfo.relics[pl].sub_affix[i].count - 1 }})</span>
            <br/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appBox {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 20% 1fr 1fr 2fr;
  gap: 0 0;
  grid-auto-flow: row;
  grid-template-areas:
    "titleBox titleBox"
    "charImg talentBox"
    "charImg relicBox"
    "infoBox relicBox";
}

.titleBox {
  grid-area: titleBox;
}

.charImg {
  grid-area: charImg;
}

.talentBox {
  grid-area: talentBox;
}

.relicBox {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0 0;
  grid-template-areas:
    "relicHead relicBody relicNeck"
    "relicHand relicFoot relicObject";
  grid-area: relicBox;
  font-size: 14px;
}

.relicHead {
  grid-area: relicHead;
}

.relicHand {
  grid-area: relicHand;
}

.relicBody {
  grid-area: relicBody;
}

.relicFoot {
  grid-area: relicFoot;
}

.relicNeck {
  grid-area: relicNeck;
}

.relicObject {
  grid-area: relicObject;
}

.infoBox {
  text-align: left;
  padding: 20px;
  grid-area: infoBox;
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

.charImg {
  margin: 10px auto;
  width: calc(100% - 20px);
  text-align: center;
}

.icon {
  height: 1em;
}

.icon2x {
  height: 2em;
}

.icon4x {
  height: 4em;
}

.talentBox {
  text-align: left;
  padding: 20px;
  height: 50px;
}

.talentBox > div {
  display: inline-block;
  text-align: center;
  margin-right: 10px;
}

.relicBox > div {
  text-align: left;
  padding: 10px;
  display: flex;
}

.relicIcon {
  margin: 20px;
  width: 64px;
}
</style>