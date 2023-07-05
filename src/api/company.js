import request from '@/utils/request'

export default{
  getCompanyList(searchModel){
    return request({
      url: '/freight/company/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        companyId: searchModel.companyId,
        companyName: searchModel.companyName,
        companyAddress: searchModel.companyAddress,
        phone: searchModel.phone
      }
    });
  },
  addCompany(company){
    return request({
      url: '/freight/company/add',
      method: 'post',
      data: {
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        phone: company.phone
      }
    });
  },
  updateCompany(company){
    return request({
      url: '/freight/company/update',
      method: 'put',
      data: {
        companyId: company.companyId,
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        phone: company.phone
      }
    });
  },
  saveCompany(company){
    if(company.companyId == null || company.companyId == undefined){
      return this.addCompany(company);
    }
    return this.updateCompany(company);
  },
  getCompanyById(companyId){
    return request({
      url: '/freight/company/' + companyId,
      method: 'get'
    });
  },
  deleteCompanyById(companyId){
    return request({
      url: '/freight/company/' + companyId,
      method: 'delete'
    });
  },
}
