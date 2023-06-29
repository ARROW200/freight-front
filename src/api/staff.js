import request from '@/utils/request'

export default{
  getStaffList(searchModel){
    return request({
      url: '/freight/staff/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        staffId: searchModel.staffId,
        staffName: searchModel.staffName,
        staffRole: searchModel.staffRole
      }
    });
  },
  addStaff(staff){
    return request({
      url: '/freight/staff/add',
      method: 'post',
      data: {
        staffName: staff.staffName,
        gender: staff.gender,
        birth: staff.birth,
        staffAddress: staff.staffAddress,
        phone: staff.phone,
        staffRole: staff.staffRole
      }
    });
  },
  updateStaff(staff){
    return request({
      url: '/freight/staff/update',
      method: 'put',
      data: {
        staffId: staff.staffId,
        staffName: staff.staffName,
        gender: staff.gender,
        birth: staff.birth,
        staffAddress: staff.staffAddress,
        phone: staff.phone,
        staffRole: staff.staffRole
      }
    });
  },
  saveStaff(staff){
    if(staff.staffId == null || staff.staffId == undefined){
      return this.addStaff(staff);
    }
    return this.updateStaff(staff);
  },
  getStaffById(staffId){
    return request({
      url: '/freight/staff/' + staffId,
      method: 'get'
    });
  },
  deleteStaffById(staffId){
    return request({
      url: '/freight/staff/' + staffId,
      method: 'delete'
    });
  },
}
