<template>
  <div id="home">
    <el-container>
      <el-header>广州地铁计价器</el-header>
      <el-main>
        <!-- 起始站 -->
        <el-row :gutter="20">
          <el-col :span="8" :offset="4">
            <div class="grid-content bg-purple">
              <el-select v-model="value" placeholder="请选择" size="medium">
                <el-option v-for="(item,key) in sLine" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-select v-model="value2" placeholder="请选择">
                <el-option v-for="(item,key) in sStation" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 终点站 -->
        <el-row :gutter="20">
          <el-col :span="8" :offset="4">
            <div class="grid-content bg-purple">
              <el-select v-model="value3" placeholder="请选择">
                <el-option v-for="(item,key) in eLine" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-select v-model="value4" placeholder="请选择">
                <el-option v-for="(item,key) in eStation" :key="key" :value="item"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="danger" icon="el-icon-search" @click="search">搜索</el-button>
        </el-row>
      </el-main>
      <el-footer>Designed by Hyman</el-footer>
    </el-container>
  </div>
</template>

<script>
import stationData from "../model/stationData";
import edgesData from "../model/edgesData";

export default {
  data() {
    return {
      value: "",
      value2: "",
      value3: "",
      value4: "",

      sLine: Object.keys(stationData),
      sStation: [],
      eLine: Object.keys(stationData),
      eStation: []
    };
  },
  watch: {
    value() {
      this.sStation = stationData[this.value];
    },
    value3() {
      this.eStation = stationData[this.value3];
    }
  },
  methods: {
    search() {}
  }
};
</script>

<style scoped>
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
</style>
