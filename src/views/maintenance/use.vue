<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.useId" placeholder="使用记录id" clearable></el-input>
      <el-input v-model="searchModel.materialId" placeholder="物资id" clearable></el-input>
      <el-input v-model="searchModel.materialName" placeholder="物资名称" clearable></el-input>
      <el-input v-model="searchModel.staffId" placeholder="员工id" clearable></el-input>
      <el-input v-model="searchModel.staffName" placeholder="姓名" clearable></el-input>
      <el-input v-model="searchModel.date" placeholder="日期" clearable></el-input>
      <el-button @click="getUseList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="useList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="useId" label="使用记录id" width="200">
        </el-table-column>
        <el-table-column prop="materialId" label="物资id" width="280">
        </el-table-column>
        <el-table-column prop="materialName" label="物资名称" width="280">
        </el-table-column>
        <el-table-column prop="cost" label="花费" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="280">
        </el-table-column>
        <el-table-column prop="staffId" label="员工id" width="200">
        </el-table-column>
        <el-table-column prop="staffName" label="姓名" width="200">
        </el-table-column>
        <el-table-column prop="date" label="日期" width="200">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="200">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.useId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteUse(scope.row.useId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="useForm" :rules="rules" ref="useFormRef">
        <el-form-item label="物资id" :label-width="formLabelWidth" prop="materialId">
          <el-input v-model="useForm.materialId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="花费" :label-width="formLabelWidth" prop="cost">
          <el-input v-model="useForm.cost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工id" :label-width="formLabelWidth" prop="staffId">
          <el-input v-model="useForm.staffId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker v-model="useForm.date" type="date"></el-date-picker>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="useForm.description" autocomplete="off"></el-input>
        </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUse">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import useApi from '@/api/use'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        useForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        useList: [],
        rules: {
          materialId: [{
            required: true,
            message: '请输入物资id',
            trigger: 'blur'
          }],
          cost: [{
            required: true,
            message: '请输入花费数量',
            trigger: 'blur'
          }],
          staffId: [{
            required: true,
            message: '请输入维修工id',
            trigger: 'blur'
          }],
          date: [{
            required: true,
            message: '请选择维修日期',
            trigger: 'blur'
          }],
          description: [{
            required: false,
            message: '请输入其他描述',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      deleteUse(useId) {
        this.$confirm(`确认删除${useId}号记录吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          useApi.deleteUseById(useId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getUseList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveUse() {
        this.$refs.useFormRef.validate((valid) => {
          if (valid) {
            useApi.saveUse(this.useForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getUseList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.useForm = {};
        this.$refs.useFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增记录";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(useId) {
        this.title = "修改记录";
        this.useForm.useId = useId;
        useApi.getUseById(useId).then(response => {
          this.useForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getUseList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getUseList();
      },
      getUseList() {
        useApi.getUseList(this.searchModel).then(response => {
          this.useList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getUseList();
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
