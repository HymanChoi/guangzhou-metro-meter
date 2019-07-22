<template>
  <div id="home">
    <el-container>
      <el-header class="header">广州地铁计价器</el-header>
      <el-main>
        <!-- 起始位置 -->
        <el-row :gutter="20">
          <el-col :span="8" :offset="4">
            <div class="grid-content bg-purple box">
              <el-select v-model="startLineValue" placeholder="请选择" size="medium">
                <el-option v-for="(item,key) in sLine" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-select v-model="startStationValue" placeholder="请选择">
                <el-option v-for="(item,key) in startStation" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 终点位置 -->
        <el-row :gutter="20">
          <el-col :span="8" :offset="4">
            <div class="grid-content bg-purple">
              <el-select v-model="endLineValue" placeholder="请选择">
                <el-option v-for="(item,key) in eLine" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-select v-model="endStationValue" placeholder="请选择">
                <el-option v-for="(item,key) in endStation" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 其他信息 -->
        <el-row>
          <el-col :span="4" :offset="4">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input class="input" v-model="input" placeholder="请输入天数"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="danger" icon="el-icon-search" @click="search">搜索</el-button>
          </el-col>
        </el-row>
        <!-- 计算结果 -->
        <el-row>
          <el-col :span="16" :offset="4" class="box">{{result}}</el-col>
        </el-row>
      </el-main>
      <el-footer>Designed by Hyman</el-footer>
    </el-container>
  </div>
</template>

<script>
import stationData from "../model/stationData";
import edgesData from "../model/edgesData";
import Dijkstra from "../model/Dijkstra";

export default {
  data() {
    return {
      startLineValue: "",
      startStationValue: "",
      endLineValue: "",
      endStationValue: "",

      sLine: Object.keys(stationData),
      startStation: [],
      eLine: Object.keys(stationData),
      endStation: [],

      value: "",
      options: [
        { value: "羊城通/岭南通" },
        { value: "老人卡" },
        { value: "学生卡" },
        { value: "车票" }
      ],
      input: "",

      result: "",
      list: []
    };
  },
  watch: {
    startLineValue() {
      this.startStation = stationData[this.startLineValue];
    },
    endLineValue() {
      this.endStation = stationData[this.endLineValue];
    }
  },
  methods: {
    search() {
      Dijkstra.addEdges(edgesData);

      let distance = "";
      let fare = "";
      if (this.startStationValue == this.endStationValue) {
        this.result = "您还是走路吧！";
      } else {
        distance = format(
          Dijkstra.shortestPath(this.startStationValue, this.endStationValue)
        );
        fare = caleFare(distance);
        this.result = "单程: " + distance + " 公里，费用:" + fare + " 元";
      }

      // 计价方式
      function caleFare(distance) {
        if (distance <= 4) return 2;
        else if (distance <= 12) return 2 + Math.ceil((distance - 4) / 4);
        else if (distance <= 24) return 4 + Math.ceil((distance - 12) / 6);
        else return 7 + Math.ceil((distance - 32) / 8);
      }

      function format(distance) {
        let s = distance + "";
        let index = s.indexOf(".");
        if (index >= 0) {
          if (s.length > index + 2) {
            s = s.substr(0, index + 2);
          }
        }
        return s;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  min-height: 80px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  min-height: 80px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

// 头部样式
.header {
  font-size: 24px;
}
// 输入框样式
.input {
  width: 200px;
}
</style>
