<template>
  <div class="ljl-popup-wrapper">
    <div class="ljl-popup-header">
      <img src="../assets/stylet-logo.svg" alt="stylet-logo" class="ljl-popup-header-logo">
      <span class="ljl-popup-header-icons">
        <i class="styleticon icon-icon-test4"></i>
        <i class="styleticon icon-icon-github"></i>
      </span>
    </div>
    <div class="ljl-popup-main">
      <div class="ljl-popup-main-banner">
        <h2 class="ljl-popup-main-banner-hostname">{{hostname}}</h2>
        <span class="ljl-popup-main-banner-title">{{title}}</span>
      </div>
      <div class="separator"></div>
      <div class="ljl-popup-main-section">
        当前未选中任何内容
      </div>
      <div class="separator"></div>
      <div class="ljl-popup-main-btn-group">
        <el-button-group>
          <el-button type="primary" @click="handleCapture">
            <el-icon><scissor /></el-icon>捕获
          </el-button>
          <el-button type="primary" @click="handleDownload">
            <el-icon><download/></el-icon>导出
          </el-button>
          <el-button type="primary" @click="handleCapture">
            <el-icon><scissor /></el-icon>保存
          </el-button>
        </el-button-group>
      </div>

    </div>
<!--    <div class="ljl-popup-footer"></div>-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Download,Scissor} from '@element-plus/icons-vue'
import {sendTabsMessage} from "../utils/tabs";

export default defineComponent({
  components: {
    Download,
    Scissor
  },
  // 已启用类型推断
  data() {
    return {
      favIconUrl:"",
      hostname:"",
      title: ""
    }
  },
  methods: {
    async handleCapture(e: MouseEvent) {
      let currentTab = await this.getCurrent()
      chrome.tabs.sendMessage(currentTab.id!, {id: "capture"}, function (response: { status: any; }) {
        console.log(response.status);
      });
    },
    async handleDownload(e: MouseEvent) {
      let currentTab = await this.getCurrent()
      chrome.tabs.sendMessage(currentTab.id!, {id: "snip"}, function (response: { status: any; }) {
        console.log(response.status);
      });
      // chrome.tabs.query({active: true, currentWindow: true}, function (tabs: { id: any; }[]) {
      //   chrome.tabs.sendMessage(tabs[0].id, {command: "snip"}, function (response: { status: any; }) {
      //     console.log(response.status);
      //   });
      // });
    },
    async getCurrent() {
      let queryOptions = {active: true, currentWindow: true};
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
  },
  async mounted() {
    let currentTab = await this.getCurrent()
    console.log("currentTab",currentTab)
    const {title, favIconUrl,url} = currentTab
    this.title = title!
    this.favIconUrl = favIconUrl!
    const {hostname} = new URLPattern(url)
    this.hostname = hostname
  }
})

function getCurrentTab() {
  throw new Error('Function not implemented.');
}
</script>

<style lang="scss">
$popup-background-color: var(--gray6);
$popup-card-background-color: white;
$popup-separator-color: var(--gray5);

.separator {
  width: 100%;
  height: 1px;
  background-color: $popup-separator-color;
  opacity: 0.5;
}

#app {
  width: 100%;
  background-color: $popup-background-color;
  .ljl-popup-wrapper {
    .ljl-popup {
      width: 100%;
      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px 0;
        &-logo{
          height: 32px;
          width: auto;
        }
        &-icons{
          width: 45px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .styleticon{
            font-size: 19px;
            color: #999999;
            margin: 0 2px;
          }
        }
      }

      &-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 7px 16px 16px;
        padding: 0 16px;
        border-radius: 4px;
        background-color: $popup-card-background-color;

        &-banner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &-favicon{
            height: 32px;
            margin-top: 10px;
          }
          &-hostname{
            font-size: 18px;
            font-weight: 700;
            justify-content: center;
            overflow-wrap: anywhere;
            padding: 10px 0;
          }
          &-title{
            text-align: center;
            font-size: 14px;
            margin-bottom: 10px;
            overflow-wrap: anywhere;
            line-height: 15px;
          }
        }

        &-section{

        }

        &-btn-group{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0;
        }
      }

      &-footer {
        padding: 16px;
      }
    }
  }
}
</style>
