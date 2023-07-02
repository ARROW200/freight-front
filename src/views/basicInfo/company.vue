<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.companyId" placeholder="编号" clearable></el-input>
      <el-input v-model="searchModel.companyName" placeholder="公司名" clearable></el-input>
      <el-input v-model="searchModel.companyAddress" placeholder="地址" clearable></el-input>
      <el-input v-model="searchModel.phone" placeholder="联系电话" clearable></el-input>
      <el-button @click="getCompanyList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="companyList" stripe style="width: 100%">
        <el-table-column label="" width="40">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="companyId" label="编号" width="120">
        </el-table-column>
        <el-table-column prop="companyName" label="公司名" width="250">
        </el-table-column>
        <el-table-column prop="companyAddress" label="地址" width="300">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="250">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.companyId)" type="primary" icon="el-icon-edit" circle>
            </el-button>
            <el-button @click="deleteCompany(scope.row.companyId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="companyForm" :rules="rules" ref="companyFormRef">
        <el-form-item label="公司名" :label-width="formLabelWidth" prop="companyName">
          <el-input v-model="companyForm.companyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="companyAddress">
          <el-input v-model="companyForm.companyAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="companyForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCompany">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import companyApi from '@/api/company'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        companyForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        companyList: [],
        rules: {
          companyName: [{
            required: true,
            message: '请输入公司名',
            trigger: 'blur'
          }],
          companyAddress: [{
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      deleteCompany(companyId) {
        this.$confirm(`确认删除${companyId}号公司吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          companyApi.deleteCompanyById(companyId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getCompanyList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveCompany() {
        this.$refs.companyFormRef.validate((valid) => {
          if (valid) {
            companyApi.saveCompany(this.companyForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getCompanyList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.companyForm = {};
        this.$refs.companyFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增公司信息";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(companyId) {
        this.title = "修改公司信息";
        this.companyForm.companyId = companyId;
        companyApi.getCompanyById(companyId).then(response => {
          this.companyForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getCompanyList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getCompanyList();
      },
      getCompanyList() {
        companyApi.getCompanyList(this.searchModel).then(response => {
          this.companyList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getCompanyList();
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
