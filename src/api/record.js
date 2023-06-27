import request from '@/utils/request'

export default{
  getRecordList(searchModel){
    return request({
      url: '/freight/record/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        vehicleId: searchModel.vehicleId,
        driverName: searchModel.driverName,
        freightId: searchModel.freightId,
        recordId: searchModel.recordId
      }
    });
  },
  addRecord(record){
    return request({
      url: '/freight/record/add',
      method: 'post',
      data: {
        vehicleId: record.vehicleId,
        driverId: record.driverId,
        freightId: record.freightId,
        startAddress: record.startAddress,
        endAddress: record.endAddress,
        startTime: record.startTime,
        endTime: record.endTime,
        status : record.status
      }
    });
  },
  updateRecord(record){
    return request({
      url: '/freight/record/update',
      method: 'put',
      data: {
        recordId: record.recordId,
        vehicleId: record.vehicleId,
        driverId: record.driverId,
        freightId: record.freightId,
        startAddress: record.startAddress,
        endAddress: record.endAddress,
        startTime: record.startTime,
        endTime: record.endTime,
        status : record.status
      }
    });
  },
  saveRecord(record){
    if(record.recordId == null || record.recordId == undefined){
      return this.addRecord(record);
    }
    return this.updateRecord(record);
  },
  getRecordById(recordId){
    return request({
      url: '/freight/record/' + recordId,
      method: 'get'
    });
  },
  deleteRecordById(recordId){
    return request({
      url: '/freight/record/' + recordId,
      method: 'delete'
    });
  },
}
