<template>
  <div id="home">
    <el-container>
      <el-header class="header">广州地铁计价器</el-header>
      <el-main>
        <!-- 起点位置 -->
        <el-row>
          <el-col :span="8" :offset="4">
            <label class="label">起点线:</label>
            <el-select v-model="startLineValue" placeholder="请选择">
              <el-option v-for="(item,key) in sLine" :key="key" :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label class="label label2">起点站:</label>
            <el-select v-model="startStationValue" placeholder="请选择">
              <el-option v-for="(item,key) in startStation" :key="key" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 终点位置 -->
        <el-row>
          <el-col :span="8" :offset="4">
            <label class="label">终点线:</label>
            <el-select v-model="endLineValue" placeholder="请选择">
              <el-option v-for="(item,key) in eLine" :key="key" :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label class="label label2">终点线:</label>
            <el-select v-model="endStationValue" placeholder="请选择">
              <el-option v-for="(item,key) in endStation" :key="key" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 其他信息 -->
        <el-row>
          <el-col :span="4" :offset="4">
            <el-select v-model="way" placeholder="付费方式">
              <el-option v-for="(item,key) in options" :key="key" :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input class="input" v-model="time" placeholder="乘坐次数"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button class="btn" type="danger" icon="el-icon-search" @click="search">查看</el-button>
          </el-col>
        </el-row>
        <!-- 计算结果 -->
        <el-row>
          <el-col :span="16" :offset="4" class="box">
            <el-col :span="16" class="left">
              <p class="title">计价规则</p>
              <p class="rule">
                起步4公里以内2元
                <br />4至12公里范围内每递增4公里加1元
                <br />12至24公里范围内每递增6公里加1元
                <br />24公里以后，每递增8公里加1元
              </p>
              <p class="rule">
                羊城通/岭南通: 9.5折
                <br />学生卡: 5折
                <br />老人卡(65岁以上): 5折
                <br />老人卡(60岁-65岁): 免费
                <br />重度残疾人卡: 免费
              </p>
            </el-col>
            <el-col :span="16" class="right">
              <p class="title">计算结果</p>
              <p class="content">{{result}}</p>
              <p class="content">{{total}}</p>
            </el-col>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="footer">Designed by Hyman</el-footer>
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

      way: "",
      price: "",
      options: [
        "羊城通/岭南通",
        "学生卡",
        "老人卡(65岁以上)",
        "老人卡(60岁-65岁)",
        "重度残疾人卡",
        "普通车票"
      ],
      time: "",

      result: "",
      total: ""
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
      let fareTotal = "";
      if (this.startLineValue == "" || this.startStationValue == "") {
        this.$message.error("麻烦选择起点位置");
        // this.result = "麻烦选择起点位置";
      } else if (this.endLineValue == "" || this.endStationValue == "") {
        this.$message.error("麻烦选择终点位置");
        // this.result = "麻烦选择终点位置";
      } else if (this.way == "") {
        this.$message.error("麻烦选择付费方式");
      } else if (this.time == "") {
        this.$message.error("麻烦选择乘坐次数");
      } else if (this.startStationValue == this.endStationValue) {
        this.result = "您还是走路吧！";
      } else {
        distance = format(
          Dijkstra.shortestPath(this.startStationValue, this.endStationValue)
        );
        switch (this.way) {
          case "羊城通/岭南通":
            this.price = 0.95;
            break;
          case "学生卡":
            this.price = 0.5;
            break;
          case "老人卡(65岁以上)":
            this.price = 0.5;
            break;
          case "老人卡(60岁-65岁)":
            this.price = 0;
            break;
          case "重度残疾人卡":
            this.price = 0;
            break;
          case "普通车票":
            this.price = 1;
            break;
        }
        fare = (caleFare(distance) * this.price).toFixed(2);
        fareTotal = fare * this.time;
        this.result = "单程: " + distance + " 公里, 费用:" + fare + " 元";
        this.total = "次数: " + this.time + " 次, 总费用:" + fareTotal + " 元";
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

// 头部样式
.header {
  font-size: 24px;
}
.label {
  width: 80px;
  margin-right: 20px;
}
.label2 {
  margin-left: 40px;
}
// 输入框样式
.input {
  width: 105px;
}
// 按钮样式
.btn {
  width: 305px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
// 输出框样式
.title {
  text-align: center;
  font-size: 18px;
}
.left {
  text-align: center;
}
.rule {
  margin-left: 25%;
  text-align: left;
}
.right {
  text-align: center;
}
</style>
