using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.DomainModels
{
    public class DataTableAjaxPostModel
    {
        public int pages { get; set; }
        public int draw { get; set; }
        public int start { get; set; }
        public int length { get; set; }
        public List<Column> columns { get; set; }
        public Search search { get; set; }
        public List<Order> order { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Shift { get; set; }
        public string Date { get; set; }
        public string CCode { get; set; }
        public string DCode { get; set; }
        public string CircleId { get; set; }
        public string WardId { get; set; }
        public string Status { get; set; }
        public string UserId { get; set; }
        public string EmpCode { get; set; }
        public string ContratorId { get; set; }
        public string VehicleTypeId { get; set; }
        public string Route { get; set; }
        public string Other { get; set; }
        public string FDate { get; set; }
        public string TDate { get; set; }
        public string DeviceId { get; set; }
        public string DeviceType { get; set; }
    }
    public class Column
    {
        public string data { get; set; }
        public string name { get; set; }
        public bool searchable { get; set; }
        public bool orderable { get; set; }
        public Search search { get; set; }
    }
    public class Order
    {
        public int column { get; set; }
        public string dir { get; set; }
    }
    public class Search
    {
        public string value { get; set; }
        public string regex { get; set; }
    }
    public class PagingHelperInfo
    {
        public int start { get; set; }
        public int length { get; set; }
        public string SearchTxt { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string UserId { get; set; }
    }
}
