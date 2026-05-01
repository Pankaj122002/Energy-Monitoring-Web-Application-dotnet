using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.DomainModels
{
    public class DatabaseOptions
    {
        public DatabaseOptions(string _connectionString)
        {
            ConnectionString = _connectionString;
        }
        public string ConnectionString { get; set; }
    }
}
