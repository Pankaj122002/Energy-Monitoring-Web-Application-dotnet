using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Inventory
{
    public class OrderInfo
    {
        [Key]
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public int SiteId { get; set; }
        public int AssetId { get; set; }
        public int StatusId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public decimal ApplicablePrice { get; set; }
        public bool IsActive { get; set; }
        public string CreateBy { get; set; }
    }
}
