<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.maintenanceId" placeholder="维修记录id" clearable></el-input>
      <el-input v-model="searchModel.repairmanId" placeholder="员工号" clearable></el-input>
      <el-input v-model="searchModel.repairmanName" placeholder="姓名" clearable></el-input>
      <el-input v-model="searchModel.vehicleId" placeholder="车牌号" clearable></el-input>
      <el-input v-model="searchModel.startTime" placeholder="开始日期" clearable></el-input>
      <el-input v-model="searchModel.endTime" placeholder="结束日期" clearable></el-input>
      <el-button @click="getMaintenanceList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="maintenanceList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceId" label="维修记录id" width="200">
        </el-table-column>
        <el-table-column prop="repairmanId" label="员工号" width="200">
        </el-table-column>
        <el-table-column prop="repairmanName" label="姓名" width="200">
        </el-table-column>
        <el-table-column prop="vehicleId" label="车牌号" width="200">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="200">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="200">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 2">维修中</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">维修完毕</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.maintenanceId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteMaintenance(scope.row.maintenanceId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="maintenanceForm" :rules="rules" ref="maintenanceFormRef">
        <el-form-item label="员工号" :label-width="formLabelWidth" prop="repairmanId">
          <el-input v-model="maintenanceForm.repairmanId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="vehicleId">
          <el-input v-model="maintenanceForm.vehicleId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth" prop="date">
          <el-date-picker v-model="maintenanceForm.startTime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth" prop="date">
          <el-date-picker v-model="maintenanceForm.endTime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="maintenanceForm.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMaintenance">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import maintenanceApi from '@/api/repairmanMaintenanceRecord'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        maintenanceForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        maintenanceList: [],
        rules: {
          repairmanId: [{
            required: true,
            message: '请输入维修工id',
            trigger: 'blur'
          }],
          vehicleId: [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }],
          startTime: [{
            required: false,
            message: '请输入开始时间',
            trigger: 'blur'
          }],
          endTime: [{
            required: false,
            message: '请输入结束时间',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      deleteMaintenance(maintenanceId) {
        this.$confirm(`确认删除${maintenanceId}号记录吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          maintenanceApi.deleteMaintenanceById(maintenanceId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getMaintenanceList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveMaintenance() {
        this.$refs.maintenanceFormRef.validate((valid) => {
          if (valid) {
            maintenanceApi.saveMaintenance(this.maintenanceForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getMaintenanceList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.maintenanceForm = {};
        this.$refs.maintenanceFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增记录";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(maintenanceId) {
        this.title = "修改记录";
        this.maintenanceForm.maintenanceId = maintenanceId;
        maintenanceApi.getMaintenanceById(maintenanceId).then(response => {
          this.maintenanceForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getMaintenanceList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getMaintenanceList();
      },
      getMaintenanceList() {
        maintenanceApi.getMaintenanceList(this.searchModel).then(response => {
          this.maintenanceList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getMaintenanceList();
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
