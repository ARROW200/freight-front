<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.materialId" placeholder="物资号" clearable></el-input>
      <el-input v-model="searchModel.materialName" placeholder="物资名" clearable></el-input>
      <el-button @click="getMaterialList(3)" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="materialList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="materialId" label="物资号" width="100">
        </el-table-column>
        <el-table-column prop="materialName" label="物资名" width="180">
        </el-table-column>
        <el-table-column prop="count" label="数量" width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="180">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.materialId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteMaterial(scope.row.materialId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="materialForm" :rules="rules" ref="materialFormRef">
        </el-form-item>
        <el-form-item label="物资名" :label-width="formLabelWidth" prop="materialName">
          <el-input v-model="materialForm.materialName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="count">
          <el-input v-model="materialForm.count" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth" prop="unit">
          <el-input v-model="materialForm.unit" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMaterial">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import materialApi from '@/api/material'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        materialForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        materialList:[],
        rules: {
            materialName: [{
            required: true,
            message: '请输入物资名',
            trigger: 'blur'
          }],
          count: [{
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            message: '请输入单位',
            trigger: 'blur'
          }],
        }
      };
    },
    methods: {
      deleteMaterial(materialId) {
        this.$confirm(`确认删除${materialId}号物资吗`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  materialApi.deleteMaterialById(materialId).then(response => {
                    this.$message({
                      type: 'success',
                      message: response.message
                    });
                    this.getMaterialList();
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
      },
      saveMaterial() {
        this.$refs.materialFormRef.validate((valid) => {
          if (valid) {
            materialApi.saveMaterial(this.materialForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getMaterialList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.materialForm = {};
        this.$refs.materialFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增物资";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(materialId) {
        this.title = "修改物资信息";
        this.materialForm.materialId = materialId;
        materialApi.getMaterialById(materialId).then(response => {
          this.materialForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getMaterialList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getMaterialList();
      },
      getMaterialList() {
        materialApi.getMaterialList(this.searchModel).then(response => {
          this.materialList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getMaterialList(3);
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
