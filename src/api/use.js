import request from '@/utils/request'

export default{
  getUseList(searchModel){
    return request({
      url: '/freight/use/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        useId: searchModel.useId,
        materialId:searchModel.materialId,
        materialName: searchModel.materialName,
        staffId: searchModel.staffId,
        staffName: searchModel.staffName,
        date: searchModel.date
      }
    });
  },
  addUse(use){
    return request({
      url: '/freight/use/add',
      method: 'post',
      data: {
        useId: use.useId,
        materialId:use.materialId,
        materialName: use.materialName,
        cost: use.cost,
        unit: use.unit,
        staffId: use.staffId,
        staffName: use.staffName,
        date: use.date,
        description:use.description,
        status : use.status
      }
    });
  },
  updateUse(use){
    return request({
      url: '/freight/use/update',
      method: 'put',
      data: {
        useId: use.useId,
        materialId:use.materialId,
        materialName: use.materialName,
        cost: use.cost,
        unit: use.unit,
        staffId: use.staffId,
        staffName: use.staffName,
        date: use.date,
        description:use.description,
        status : use.status
      }
    });
  },
  saveUse(use){
    if(use.useId == null || use.useId == undefined){
      return this.addUse(use);
    }
    return this.updateUse(use);
  },
  getUseById(useId){
    return request({
      url: '/freight/use/' + useId,
      method: 'get'
    });
  },
  deleteUseById(useId){
    return request({
      url: '/freight/use/' + useId,
      method: 'delete'
    });
  },
}
