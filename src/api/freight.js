import request from '@/utils/request'

export default{
  getFreightList(searchModel){
    return request({
      url: '/freight/freight/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        freightId: searchModel.freightId,
        freightName: searchModel.freightName,
        weight: searchModel.weight,
        type: searchModel.type
      }
    });
  },
  addFreight(freight){
    return request({
      url: '/freight/freight/add',
      method: 'post',
      data: {
        freightName: freight.freightName,
        weight: freight.weight,
        type: freight.type,
        description: freight.description
      }
    });
  },
  updateFreight(freight){
    return request({
      url: '/freight/freight/update',
      method: 'put',
      data: {
        freightId: freight.freightId,
        freightName: freight.freightName,
        weight: freight.weight,
        type: freight.type,
        description: freight.description
      }
    });
  },
  saveFreight(freight){
    if(freight.freightId == null || freight.freightId == undefined){
      return this.addFreight(freight);
    }
    return this.updateFreight(freight);
  },
  getFreightById(freightId){
    return request({
      url: '/freight/freight/' + freightId,
      method: 'get'
    });
  },
  deleteFreightById(freightId){
    return request({
      url: '/freight/freight/' + freightId,
      method: 'delete'
    });
  },
}
