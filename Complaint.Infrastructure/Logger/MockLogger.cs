using ComplaintMGT.Abstractions;
using System;
using System.Linq;

namespace ComplaintMGT.Infrastructure.Logger
{
    public class MockLogger //: ILogger
    {
        
        public void Error(string message)
        {
            throw new NotImplementedException();
        }

        public void Error(string format, string message)
        {
            throw new NotImplementedException();
        }

        public void Debug(string message)
        {
            throw new NotImplementedException();
        }

        public void Debug(string format, string message)
        {
            throw new NotImplementedException();
        }

        public void Info(string message)
        {
            throw new NotImplementedException();
        }

        public void Info(string format, string message)
        {
            throw new NotImplementedException();
        }

        public void Warn(string message)
        {
            throw new NotImplementedException();
        }

        public void Warn(string format, string message)
        {
            throw new NotImplementedException();
        }

        public void Fatal(string message)
        {
            throw new NotImplementedException();
        }

        public void Fatal(string format, string message)
        {
            throw new NotImplementedException();
        }
    }
}
