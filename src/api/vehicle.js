import request from '@/utils/request'

export default{
  getVehicleList(searchModel){
    return request({
      url: '/freight/vehicle/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        vehicleId: searchModel.vehicleId,
        type: searchModel.type,
        load: searchModel.load,
        status: searchModel.status
      }
    });
  },
  addVehicle(vehicle){
    return request({
      url: '/freight/vehicle/add',
      method: 'post',
      data: {
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        load: vehicle.load,
        status: vehicle.status
      }
    });
  },
  updateVehicle(vehicle){
    return request({
      url: '/freight/vehicle/update',
      method: 'put',
      data: {
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        load: vehicle.load,
        status: vehicle.status
      }
    });
  },
  saveVehicle(vehicle){
    if(vehicle.method == 'add'){
      return this.addVehicle(vehicle);
    }
    if(vehicle.method == 'update'){
      return this.updateVehicle(vehicle);
    }
  },
  getVehicleById(vehicleId){
    return request({
      url: '/freight/vehicle/' + vehicleId,
      method: 'get'
    });
  },
  deleteVehicleById(vehicleId){
    return request({
      url: '/freight/vehicle/' + vehicleId,
      method: 'delete'
    });
  },
}
