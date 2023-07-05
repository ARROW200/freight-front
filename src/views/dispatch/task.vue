<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-input v-model="searchModel.taskId" placeholder="运输任务号" clearable></el-input>
      <el-input v-model="searchModel.senderId" placeholder="发送方ID" clearable></el-input>
      <el-input v-model="searchModel.receiverId" placeholder="接收方ID" clearable></el-input>
      <el-input v-model="searchModel.senderName" placeholder="发送方名称" clearable></el-input>
      <el-input v-model="searchModel.receiverName" placeholder="接收方名称" clearable></el-input>
      <el-button @click="gettaskList" type="primary" round icon="el-icon-search">查询</el-button>
      <el-button @click="openAddEditUI()" type="primary" circle icon="el-icon-plus"></el-button>
    </el-card>

    <el-card>
      <!-- 结果列表 -->
      <el-table :data="taskList" stripe style="width: 100%">
        <el-table-column label="" width="40">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1)*searchModel.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="taskId" label="任务号" width="100">
        </el-table-column>
        <el-table-column prop="senderId" label="发送方ID" width="120">
        </el-table-column>
        <el-table-column prop="receiverId" label="接收方ID" width="100">
        </el-table-column>
        <el-table-column prop="senderName" label="发送方名称" width="100">
        </el-table-column>
        <el-table-column prop="receiverName" label="接收方名称" width="100">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 2">正在运输</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="openUpdateEditUI(scope.row.taskId)" type="primary" icon="el-icon-edit" circle>
            </el-button>
            <el-button @click="deletetask(scope.row.taskId)" type="danger" icon="el-icon-delete" circle></el-button>
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
      <el-form :model="taskForm" :rules="rules" ref="taskFormRef">
        <el-form-item label="任务号" :label-width="formLabelWidth" prop="taskId">
          <el-input v-model="taskForm.taskId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送方ID" :label-width="formLabelWidth" prop="senderId">
          <el-input v-model="taskForm.senderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收方ID" :label-width="formLabelWidth" prop="receiverId">
          <el-input v-model="taskForm.receiverId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送方名称" :label-width="formLabelWidth" prop="senderName">
          <el-input v-model="taskForm.senderName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收方名称" :label-width="formLabelWidth" prop="receiverName">
          <el-input v-model="taskForm.receiverName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="taskForm.status" :active-value="1" :inactive-value="2">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savetask">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import taskApi from '@/api/task'
  export default {
    data() {
      return {
        formLabelWidth: '130px',
        taskForm: {

        },
        dialogFormVisible: false,
        title: "",
        total: 0,
        searchModel: {
          pageNo: 1,
          pageSize: 10
        },
        taskList: [],
        rules: {
          taskId: [{
            required: true,
            message: '请输入任务号',
            trigger: 'blur'
          }],
          senderId: [{
            required: true,
            message: '请输入发送方ID',
            trigger: 'blur'
          }],
          receiverId: [{
            required: true,
            message: '请输入接收方ID',
            trigger: 'blur'
          }],
          senderName: [{
            required: true,
            message: '请输入发送方名称',
            trigger: 'blur'
          }],
          receiverName: [{
            required: true,
            message: '请输入接收方名称',
            trigger: 'blur'
          }],
        }
      };
    },
    methods: {
      deletetask(taskId) {
        this.$confirm(`确认删除${taskId}号记录吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          taskApi.deletetaskById(taskId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.gettaskList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      savetask() {
        this.$refs.taskFormRef.validate((valid) => {
          if (valid) {
            taskApi.savetask(this.taskForm).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.gettaskList();
            });
          } else {
            console.log("error submit!");
            this.$message.error(response.message);
            return false;
          }
        });
      },
      clearForm() {
        this.taskForm = {};
        this.$refs.taskFormRef.clearValidate();
      },
      openAddEditUI() {
        this.title = "新增记录";
        this.dialogFormVisible = true;
      },
      openUpdateEditUI(taskId) {
        this.title = "修改记录";
        this.taskForm.taskId = taskId;
        taskApi.gettaskById(taskId).then(response => {
          this.taskForm = response.data;
        });
        this.dialogFormVisible = true;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.gettaskList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.gettaskList();
      },
      gettaskList() {
        taskApi.gettaskList(this.searchModel).then(response => {
          this.taskList = response.data.rows;
          this.total = response.data.total;
        });
      }
    },
    created() {
      this.gettaskList();
    }
  };
</script>

<style>
</style>
