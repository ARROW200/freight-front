import request from '@/utils/request'

export default{
  gettaskList(searchModel){
    return request({
      url: '/freight/task/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        taskId: searchModel.taskId,
        senderId: searchModel.senderId,
        receiverId: searchModel.receiverId,
        senderName: searchModel.senderName,
        receiverName: searchModel.recreceiverName,        
        status: searchModel.status
      }
    });
  },
  addtask(task){
    return request({
      url: '/freight/task/add',
      method: 'post',
      data: {
        taskId: task.taskId,
        senderId: task.senderId,
        receiverId: task.receiverId,
        senderName: task.senderName,
        receiverName: task.receiverName,
        status : task.status
      }
    });
  },
  updatetask(task){
    return request({
      url: '/freight/task/update',
      method: 'put',
      data: {
        taskId: task.taskId,
        senderId: task.senderId,
        receiverId: task.receiverId,
        senderName: task.senderName,
        receiverName: task.receiverName,
        status : task.status
      }
    });
  },
  savetask(task){
    if(task.taskId == null || task.taskId == undefined){
      return this.addtask(task);
    }
    return this.updatetask(task);
  },
  gettaskById(taskId){
    return request({
      url: '/freight/task/' + taskId,
      method: 'get'
    });
  },
  deletetaskById(taskId){
    return request({
      url: '/freight/task/' + taskId,
      method: 'delete'
    });
  },
}
