<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-input v-model="searchModel.purchaseId" placeholder="采购记录号" clearable></el-input>
      <el-input v-model="searchModel.itemName" placeholder="物品名" clearable></el-input>
      <el-input v-model="searchModel.purchaserId" placeholder="员工号" clearable></el-input>
      <el-input v-model="searchModel.purchaserName" placeholder="姓名" clearable></el-input>
      <el-button @click="getPurchaseList(1)" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="purchaseList" stripe style="width: 100%">
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="purchaseId" label="采购记录号" width="100">
        </el-table-column>
        <el-table-column prop="itemName" label="物品名" width="100">
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
        </el-table-column>
        <el-table-column prop="amount" label="数量" width="100">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100">
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价" width="100">
        </el-table-column>
        <el-table-column prop="purchaserId" label="员工号" width="100">
        </el-table-column>
        <el-table-column prop="purchaserName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="date" label="日期" width="160">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.purchaseId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deletePurchase(scope.row.purchaseId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="purchaseForm" :rules="rules" ref="purchaseFormRef">
        <el-form-item label="物品名" :label-width="formLabelWidth" prop="itemName">
          <el-input v-model="purchaseForm.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth" prop="price">
          <el-input v-model="purchaseForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="amount">
          <el-input v-model="purchaseForm.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth" prop="unit">
          <el-input v-model="purchaseForm.unit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总价" :label-width="formLabelWidth" prop="totalPrice">
          <el-input v-model="purchaseForm.totalPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工号" :label-width="formLabelWidth" prop="purchaserId">
          <el-input v-model="purchaseForm.purchaserId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker v-model="purchaseForm.date" type="date"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePurchase">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import purchaseApi from '@/api/purchase'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        purchaseForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        purchaseList: [],
        rules: {
          itemName: [{
            required: true,
            message: '请输入物品名',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: '请输入单价',
            trigger: 'blur'
          }],
          amount: [{
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            message: '请输入单位',
            trigger: 'blur'
          }],
          totalPrice: [{
            required: true,
            message: '请输入总价',
            trigger: 'blur'
          }],
          purchaserId: [{
            required: true,
            message: '请输入员工号',
            trigger: 'blur'
          }],
          date: [{
            required: true,
            message: '请选择采购日期',
            trigger: 'change'
          }]
        }
      };
    },
    methods: {
      deletePurchase(purchaseId) {
        this.$confirm(`确认删除${purchaseId}号采购记录吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          purchaseApi.deletePurchaseById(purchaseId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getPurchaseList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      savePurchase() {
        this.purchaseForm.type = 1;
        this.$refs.purchaseFormRef.validate((valid) => {
          if (valid) {
            purchaseApi.savePurchase(this.purchaseForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getPurchaseList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.purchaseForm = {};
        this.$refs.purchaseFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增采购记录";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(purchaseId) {
        this.title = "修改采购记录";
        this.purchaseForm.purchaseId = purchaseId;
        purchaseApi.getPurchaseById(purchaseId).then(response => {
          this.purchaseForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getPurchaseList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getPurchaseList();
      },
      getPurchaseList(type) {
        this.searchModel.type = type;
        purchaseApi.getPurchaseList(this.searchModel).then(response => {
          this.purchaseList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.getPurchaseList();
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
