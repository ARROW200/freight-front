import request from '@/utils/request'

export default{
  getPurchaseList(searchModel){
    return request({
      url: '/freight/purchase/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        purchaseId: searchModel.purchaseId,
        type:searchModel.type,
        itemName: searchModel.itemName,
        price:searchModel.price,
        amount:searchModel.amount,
        unit:searchModel.unit,
        totalPrice:searchModel.totalPrice,
        purchaserId: searchModel.purchaserId,
        purchaserName: searchModel.purchaserName,
        date: searchModel.date
      }
    });
  },
  addPurchase(purchase){
    return request({
      url: '/freight/purchase/add',
      method: 'post',
      data: {
        type:purchase.type,
        itemName: purchase.itemName,
        price:purchase.price,
        amount:purchase.amount,
        unit:purchase.unit,
        totalPrice:purchase.totalPrice,
        purchaserId: purchase.purchaserId,
        date: purchase.date,
        status:purchase.status
      }
    });
  },
  updatePurchase(purchase){
    return request({
      url: '/freight/purchase/update',
      method: 'put',
      data: {
        purchaseId:purchase.purchaseId,
        type:purchase.type,
        itemName: purchase.itemName,
        price:purchase.price,
        amount:purchase.amount,
        unit:purchase.unit,
        totalPrice:purchase.totalPrice,
        purchaserId: purchase.purchaserId,
        date: purchase.date,
        status:purchase.status
      }
    });
  },
  savePurchase(purchase){
    if(purchase.purchaseId == null || purchase.purchaseId == undefined){
      return this.addPurchase(purchase);
    }
    return this.updatePurchase(purchase);
  },
  getPurchaseById(purchaseId){
    return request({
      url: '/freight/purchase/' + purchaseId,
      method: 'get'
    });
  },
  deletePurchaseById(purchaseId){
    return request({
      url: '/freight/purchase/' + purchaseId,
      method: 'delete'
    });
  },
}
