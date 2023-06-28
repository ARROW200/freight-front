<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.userId" placeholder="用户号" clearable></el-input>
      <el-input v-model="searchModel.username" placeholder="用户名" clearable></el-input>
      <el-input v-model="searchModel.userRole" placeholder="职务" clearable></el-input>
      <el-button @click="getUserList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户号" width="200">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="280">
        </el-table-column>
        <el-table-column prop="userRole" label="职务" width="280">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userRole == 1" type="danger">管理员</el-tag>
            <el-tag v-if="scope.row.userRole == 2" >修理工</el-tag>
            <el-tag v-if="scope.row.userRole == 3" >司机</el-tag>
            <el-tag v-if="scope.row.userRole == 4" >采购员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.userId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteUser(scope.row.userId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="userForm" :rules="rules" ref="userFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="职务" :label-width="formLabelWidth" prop="userRole">
          <el-input v-model="userForm.userRole" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import userApi from '@/api/user'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        userForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        userList: [],
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 6, message: '密码长度不小于 6 个字符', trigger: 'blur' }],
          userRole: [{
            required: true,
            message: '请输入职务',
            trigger: 'blur'
          }],
        }
      };
    },
    methods: {
      deleteUser(userId) {
        this.$confirm(`确认删除${userId}号用户吗`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  userApi.deleteUserById(userId).then(response => {
                    this.$message({
                      type: 'success',
                      message: response.message
                    });
                    this.getUserList();
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
      },
      saveUser() {
        this.$refs.userFormRef.validate((valid) => {
          if (valid) {
            userApi.saveUser(this.userForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getUserList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.userForm = {};
        this.$refs.userFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增用户";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(userId) {
        this.title = "修改用户";
        this.userForm.userId = userId;
        userApi.getUserById(userId).then(response => {
          this.userForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getUserList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getUserList();
      },
      getUserList() {
        userApi.getUserList(this.searchModel).then(response => {
          this.userList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getUserList();
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
