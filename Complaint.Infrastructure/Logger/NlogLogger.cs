using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Infrastructure.Logger
{
    public class NlogLogger //: ComplaintMGT.Abstractions.ILogger
    {
        //http://netcommon.sourceforge.net/docs/2.0.0/reference/html/ch01.html

        //private static readonly NLog.ILogger _log;

        //static NlogLogger()
        //{
        //    var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Bin", "NLog.config");
        //    NLog.LogManager.Configuration = new NLog.Config.XmlLoggingConfiguration(logPath, true);
        //    _log = NLog.LogManager.GetLogger("ComplaintMGT.Api");
        //}

        ///// <summary>
        ///// Member to provide Error level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Error(string message)
        //{
        //    if (_log.IsErrorEnabled)
        //    {
        //        _log.Error(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Error level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Error(string format, string message)
        //{
        //    if (_log.IsErrorEnabled)
        //    {
        //        message = string.Format(format, message);
        //        _log.Error(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Debug level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Debug(string message)
        //{
        //    if (_log.IsDebugEnabled)
        //    {
        //        _log.Debug(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Debug level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Debug(string format, string message)
        //{
        //    if (_log.IsDebugEnabled)
        //    {
        //        message = string.Format(format, message);
        //        _log.Debug(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Info level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Info(string message)
        //{
        //    if (_log.IsInfoEnabled)
        //    {
        //        _log.Info(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Info level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Info(string format, string message)
        //{
        //    if (_log.IsInfoEnabled)
        //    {
        //        message = string.Format(format, message);
        //        _log.Info(message);
        //    }
        //}
        ///// <summary>
        ///// Member to provide Warning level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Warn(string message)
        //{
        //    if (_log.IsWarnEnabled)
        //    {
        //        _log.Warn(message);
        //    }
        //}
        ///// <summary>
        ///// Member to provide Warning level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Warn(string format, string message)
        //{
        //    if (_log.IsWarnEnabled)
        //    {
        //        message = string.Format(format, message);
        //        _log.Warn(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Fatal level message logging
        ///// </summary>
        ///// <param name="message"></param>
        //public void Fatal(string message)
        //{
        //    if (_log.IsFatalEnabled)
        //    {
        //        _log.Fatal(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Fatal level message logging
        ///// </summary>
        ///// <param name="message"></param>
        //public void Fatal(string format, string message)
        //{
        //    if (_log.IsFatalEnabled)
        //    {
        //        message = string.Format(format, message);
        //        _log.Fatal(message);
        //    }
        //}
    }
}
