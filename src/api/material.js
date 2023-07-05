import request from '@/utils/request'

export default{
  getMaterialList(searchModel){
    return request({
      url: '/freight/material/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        materialId: searchModel. materialId,
        materialName: searchModel. materialName,
        count: searchModel.count,
        unit: searchModel.unit
      }
    });
  },
  addMaterial(material){
    return request({
      url: '/freight/material/add',
      method: 'post',
      data: {
        materialName: material.materialName,
        count:  material.count,
        unit: material.unit,
        status:material.status
      }
    });
  },
  updateMaterial(material){
    return request({
      url: '/freight/material/update',
      method: 'put',
      data: {
        materialId:material.materialId,
        materialName: material.materialName,
        count: material.count,
        unit: material.unit,
        status:material.status
      }
    });
  },
  saveMaterial(material){
    if(material.materialId == null || material.materialId == undefined){
      return this.addMaterial(material);
    }
    return this.updateMaterial(material);
  },
  getMaterialById(materialId){
    return request({
      url: '/freight/material/' + materialId,
      method: 'get'
    });
  },
  deleteMaterialById(materialId){
    return request({
      url: '/freight/material/' + materialId,
      method: 'delete'
    });
  },
}
