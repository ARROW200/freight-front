<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.freightId" placeholder="货物号" clearable></el-input>
      <el-input v-model="searchModel.freightName" placeholder="货物名" clearable></el-input>
      <el-input v-model="searchModel.weight" placeholder="重量" clearable></el-input>
      <el-input v-model="searchModel.type" placeholder="类型" clearable></el-input>
      <el-button @click="getFreightList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="freightList" stripe style="width: 100%">
        <el-table-column label="" width="40">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="freightId" label="货物号" width="120">
        </el-table-column>
        <el-table-column prop="freightName" label="货物名" width="200">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="150">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="150">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="300">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.freightId)" type="primary" icon="el-icon-edit" circle>
            </el-button>
            <el-button @click="deleteFreight(scope.row.freightId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="freightForm" :rules="rules" ref="freightFormRef">
        <el-form-item label="货物名" :label-width="formLabelWidth" prop="freightName">
          <el-input v-model="freightForm.freightName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" :label-width="formLabelWidth" prop="weight">
          <el-input v-model="freightForm.weight" autocomplete="off" placeholder="单位:千克"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="freightForm.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="freightForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFreight">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import freightApi from '@/api/freight'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        freightForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        freightList: [],
        rules: {
          freightName: [{
            required: true,
            message: '请输入货物名',
            trigger: 'blur'
          }],
          weight: [{
            required: true,
            message: '请输入重量（单位：千克）',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      deleteFreight(freightId) {
        this.$confirm(`确认删除${freightId}号货物吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          freightApi.deleteFreightById(freightId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getFreightList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveFreight() {
        this.$refs.freightFormRef.validate((valid) => {
          if (valid) {
            freightApi.saveFreight(this.freightForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getFreightList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.freightForm = {};
        this.$refs.freightFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增货物信息";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(freightId) {
        this.title = "修改货物信息";
        this.freightForm.freightId = freightId;
        freightApi.getFreightById(freightId).then(response => {
          this.freightForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getFreightList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getFreightList();
      },
      getFreightList() {
        freightApi.getFreightList(this.searchModel).then(response => {
          this.freightList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getFreightList();
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
