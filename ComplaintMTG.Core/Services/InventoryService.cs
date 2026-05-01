using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Inventory;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Abstractions.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMTG.Core.SERVICES
{
    public class InventoryService : IInventory<GResposnse, OrderInfo>
    {
        private IRepository<GResposnse> _masterRepository1;
        private IRepository<OrderInfo> _masterRepository2;
     
        public InventoryService(IRepository<GResposnse> masterRepository1, IRepository<OrderInfo> masterRepository2)
        {

            this._masterRepository1 = masterRepository1;
            this._masterRepository2 = masterRepository2;
          

        }

        public GResposnse AddAndUpdate(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingle(spQuery, Param);
        }
        public string GetAll(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicList(spQuery, Param);
        }
        public string Delete(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingleDynamic(spQuery, Param);
        }
        public OrderInfo GetOrderById(string spQuery, object[] Param)
        {
            return _masterRepository2.ExecuteQuerySingle(spQuery, Param);
        }
    }
}
