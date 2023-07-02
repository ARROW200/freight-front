<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.vehicleId" placeholder="车牌号" clearable></el-input>
      <el-input v-model="searchModel.type" placeholder="类型" clearable></el-input>
      <el-input v-model="searchModel.load" placeholder="载重" clearable></el-input>
      <el-input v-model="searchModel.status" placeholder="状态" clearable></el-input>
      <el-button @click="getVehicleList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="vehicleList" stripe style="width: 100%">
        <el-table-column label="" width="60">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleId" label="车牌号" width="210">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="210">
        </el-table-column>
        <el-table-column prop="load" label="载重" width="210">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="210">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">派遣中</el-tag>
            <el-tag v-if="scope.row.status == 2" type="success">空闲</el-tag>
            <el-tag v-if="scope.row.status == 3" type="danger">维修中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.vehicleId)" type="primary" icon="el-icon-edit" circle>
            </el-button>
            <el-button @click="deleteVehicle(scope.row.vehicleId)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination :current-page.sync="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="searchModel.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="vehicleForm" :rules="rules" ref="vehicleFormRef">
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="vehicleId">
          <el-input v-model="vehicleForm.vehicleId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="vehicleForm.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="载重" :label-width="formLabelWidth" prop="load">
          <el-input v-model="vehicleForm.load" autocomplete="off" placeholder="单位:千克"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <template>
            <el-radio v-model="vehicleForm.status" label="1">派遣中</el-radio>
            <el-radio v-model="vehicleForm.status" label="2">空闲</el-radio>
            <el-radio v-model="vehicleForm.status" label="3">维修中</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveVehicle">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import vehicleApi from '@/api/vehicle'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        vehicleForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        vehicleList: [],
        rules: {
          vehicleId: [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }],
          load: [{
            required: true,
            message: '请输入载重（单位：千克）',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }]
        }
      };
    },
    methods: {
      deleteVehicle(vehicleId) {
        this.$confirm(`确认删除${vehicleId}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vehicleApi.deleteVehicleById(vehicleId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getVehicleList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveVehicle() {
        this.$refs.vehicleFormRef.validate((valid) => {
          if (valid) {
            vehicleApi.saveVehicle(this.vehicleForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getVehicleList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.vehicleForm = {};
        this.$refs.vehicleFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增车辆";
        this.dialogFormVisible = true;
        this.vehicleForm.method = 'add';
      },
      openUpdateEditUI(vehicleId) {
        this.title = "修改车辆信息";
        this.vehicleForm.vehicleId = vehicleId;
        vehicleApi.getVehicleById(vehicleId).then(response => {
          this.vehicleForm = response.data;
          this.vehicleForm.method = 'update';
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getVehicleList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getVehicleList();
      },
      getVehicleList() {
        vehicleApi.getVehicleList(this.searchModel).then(response => {
          this.vehicleList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getVehicleList();
    }
  };
</script>

<style>
  #search .el-input {
    width: 120px;
    margin-right: 10px;
  }

  #search .el-button {
    margin-left: 10px;
  }

  .el-dialog .el-input {
    width: 85%;
  }
</style>
