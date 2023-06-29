<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.staffId" placeholder="员工号" clearable></el-input>
      <el-input v-model="searchModel.staffName" placeholder="姓名" clearable></el-input>
      <el-button @click="getStaffList(4)" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="staffList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="staffId" label="员工号" width="200">
        </el-table-column>
        <el-table-column prop="staffName" label="姓名" width="280">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.gender == 1">男</div>
            <div v-if="scope.row.gender == 0">女</div>
          </template>
        </el-table-column>
        <el-table-column prop="birth" label="出生日期" width="280">
        </el-table-column>
        <el-table-column prop="staffAddress" label="住址" width="280">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="280">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.staffId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteStaff(scope.row.staffId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="staffForm" :rules="rules" ref="staffFormRef">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="staffName">
          <el-input v-model="staffForm.staffName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <template>
            <el-radio v-model="staffForm.gender" label="1">男</el-radio>
            <el-radio v-model="staffForm.gender" label="0">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="birth">
          <el-date-picker v-model="staffForm.birth" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="住址" :label-width="formLabelWidth" prop="staffAddress">
          <el-input v-model="staffForm.staffAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="staffForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStaff">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import staffApi from '@/api/staff'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        staffForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        staffList: [],
        rules: {
          staffName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          birth: [{
            required: true,
            message: '请选择出生日期',
            trigger: 'change'
          }],
          staffAddress: [{
            required: true,
            message: '请输入住址',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }]
        }
      };
    },
    methods: {
      deleteStaff(staffId) {
        this.$confirm(`确认删除${staffId}号员工吗`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  staffApi.deleteStaffById(staffId).then(response => {
                    this.$message({
                      type: 'success',
                      message: response.message
                    });
                    this.getStaffList();
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
      },
      saveStaff() {
        this.staffForm.staffRole = 4;
        this.$refs.staffFormRef.validate((valid) => {
          if (valid) {
            staffApi.saveStaff(this.staffForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getStaffList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.staffForm = {};
        this.$refs.staffFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增员工";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(staffId) {
        this.title = "修改员工信息";
        this.staffForm.staffId = staffId;
        staffApi.getStaffById(staffId).then(response => {
          this.staffForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getstaffList(4);
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getStaffList(4);
      },
      getStaffList(staffRole) {
        this.searchModel.staffRole = staffRole;
        staffApi.getStaffList(this.searchModel).then(response => {
          this.staffList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getStaffList();
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
