<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.vehicleId" placeholder="车牌号" clearable></el-input>
      <el-input v-model="searchModel.driverName" placeholder="司机" clearable></el-input>
      <el-input v-model="searchModel.freightId" placeholder="货物号" clearable></el-input>
      <el-input v-model="searchModel.recordId" placeholder="记录号" clearable></el-input>
      <el-button @click="getRecordList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="recordList" stripe style="width: 100%">
        <el-table-column label="" width="40">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="recordId" label="记录号" width="100">
        </el-table-column>
        <el-table-column prop="vehicleId" label="车牌号" width="120">
        </el-table-column>
        <el-table-column prop="driverId" label="司机编号" width="100">
        </el-table-column>
        <el-table-column prop="driverName" label="司机姓名" width="100">
        </el-table-column>
        <el-table-column prop="freightId" label="货物号" width="100">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="140">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="140">
        </el-table-column>
        <el-table-column prop="startAddress" label="发货地址" width="200">
        </el-table-column>
        <el-table-column prop="endAddress" label="收货地址" width="200">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">运送中</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">已送达</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.recordId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteRecord(scope.row.recordId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="recordForm" :rules="rules" ref="recordFormRef">
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="vehicleId">
          <el-input v-model="recordForm.vehicleId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="司机编号" :label-width="formLabelWidth" prop="driverId">
          <el-input v-model="recordForm.driverId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货物号" :label-width="formLabelWidth" prop="freightId">
          <el-input v-model="recordForm.freightId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发货地址" :label-width="formLabelWidth" prop="startAddress">
          <el-input v-model="recordForm.startAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth" prop="endAddress">
          <el-input v-model="recordForm.endAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth" prop="startTime">
          <el-date-picker v-model="recordForm.startTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth" prop="endTime">
          <el-date-picker v-model="recordForm.endTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="recordForm.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRecord">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import recordApi from '@/api/record'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        recordForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        recordList: [],
        rules: {
          vehicleId: [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }],
          driverId: [{
            required: true,
            message: '请输入司机编号',
            trigger: 'blur'
          }],
          freightId: [{
            required: true,
            message: '请输入货物号',
            trigger: 'blur'
          }],
          startAddress: [{
            required: true,
            message: '请输入发货地址',
            trigger: 'blur'
          }],
          endAddress: [{
            required: true,
            message: '请输入收货地址',
            trigger: 'blur'
          }],
          startTime: [{
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }]
        }
      };
    },
    methods: {
      deleteRecord(recordId) {
        this.$confirm(`确认删除${recordId}号记录吗`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  recordApi.deleteRecordById(recordId).then(response => {
                    this.$message({
                      type: 'success',
                      message: response.message
                    });
                    this.getRecordList();
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
      },
      saveRecord() {
        this.$refs.recordFormRef.validate((valid) => {
          if (valid) {
            recordApi.saveRecord(this.recordForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getRecordList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.recordForm = {};
        this.$refs.recordFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增记录";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(recordId) {
        this.title = "修改记录";
        this.recordForm.recordId = recordId;
        recordApi.getRecordById(recordId).then(response => {
          this.recordForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getRecordList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getRecordList();
      },
      getRecordList() {
        recordApi.getRecordList(this.searchModel).then(response => {
          this.recordList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getRecordList();
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
