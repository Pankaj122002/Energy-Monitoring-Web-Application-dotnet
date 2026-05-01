using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Messages
{
    public class ApiExecutionException: Exception
    {
        public ApiExecutionException(string message):base(message)
        {

        }

        public ApiExecutionException(string message, Exception innerException)
            : base(message, innerException)
        {

        }
    }
}
