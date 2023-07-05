import request from '@/utils/request'

export default{
  getMaintenanceList(searchModel){
    return request({
      url: '/freight/maintenance/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        maintenanceId: searchModel.maintenanceId,
        repairmanId: searchModel.repairmanId,
        repairmanName:searchModel.repairmanName,
        vehicleId:searchModel.vehicleId,
        startTime: searchModel.startTime,
        endTime: searchModel.endTime
      }
    });
  },
  addMaintenance(maintenance){
    return request({
      url: '/freight/maintenance/add',
      method: 'post',
      data: {
        maintenanceId: maintenance.maintenanceId,
        repairmanId: maintenance.repairmanId,
        repairmanName: maintenance.repairmanName,
        vehicleId:maintenance.vehicleId,
        startTime: maintenance.startTime,
        endTime:maintenance.endTime,
        status : maintenance.status
      }
    });
  },
  updateMaintenance(maintenance){
    return request({
      url: '/freight/maintenance/update',
      method: 'put',
      data: {
        maintenanceId: maintenance.maintenanceId,
        repairmanId: maintenance.repairmanId,
        repairmanName: maintenance.repairmanName,
        vehicleId:maintenance.vehicleId,
        startTime: maintenance.startTime,
        endTime:maintenance.endTime,
        status : maintenance.status
      }
    });
  },
  saveMaintenance(maintenance){
    if(maintenance.maintenanceId == null || maintenance.maintenanceId == undefined){
      return this.addMaintenance(maintenance);
    }
    return this.updateMaintenance(maintenance);
  },
  getMaintenanceById(maintenanceId){
    return request({
      url: '/freight/maintenance/' + maintenanceId,
      method: 'get'
    });
  },
  deleteMaintenanceById(maintenanceId){
    return request({
      url: '/freight/maintenance/' + maintenanceId,
      method: 'delete'
    });
  },
}
