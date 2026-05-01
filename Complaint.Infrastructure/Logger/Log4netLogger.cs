using ComplaintMGT.Abstractions;
//using log4net;
using System;
using System.IO;
namespace ComplaintMGT.Infrastructure.Logger
{
    public class Log4netLogger//: ILogger
    {
        //https://logging.apache.org/log4net/release/config-examples.html
       // private static readonly log4net.ILog Log;

        //static Log4netLogger()
        //{
        //    var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Bin", "Log4net.config");

        //    log4net.Config.XmlConfigurator.Configure(new Uri(logPath));

        //    Log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        //    Log = LogManager.GetLogger("ComplaintMGT.Api");
        //}

        ///// <summary>
        ///// Member to provide Error level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Error(string message)
        //{
        //    if (Log.IsErrorEnabled)
        //    {
        //        Log.Error(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Error level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Error(string format, string message)
        //{
        //    if (Log.IsErrorEnabled)
        //    {
        //        message = string.Format(format, message);
        //        Log.Error(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Debug level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Debug(string message)
        //{
        //    if (Log.IsDebugEnabled)
        //    {
        //        Log.Debug(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Debug level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Debug(string format, string message)
        //{
        //    if (Log.IsDebugEnabled)
        //    {
        //        message = string.Format(format, message);
        //        Log.Debug(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Info level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Info(string message)
        //{
        //    if (Log.IsInfoEnabled)
        //    {
        //        Log.Info(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Info level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Info(string format, string message)
        //{
        //    if (Log.IsInfoEnabled)
        //    {
        //        message = string.Format(format, message);
        //        Log.Info(message);
        //    }
        //}
        ///// <summary>
        ///// Member to provide Warning level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Warn(string message)
        //{
        //    if (Log.IsWarnEnabled)
        //    {
        //        Log.Warn(message);
        //    }
        //}
        ///// <summary>
        ///// Member to provide Warning level message logging 
        ///// </summary>
        ///// <param name="message"></param>
        //public void Warn(string format, string message)
        //{
        //    if (Log.IsWarnEnabled)
        //    {
        //        message = string.Format(format, message);
        //        Log.Warn(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Fatal level message logging
        ///// </summary>
        ///// <param name="message"></param>
        //public void Fatal(string message)
        //{
        //    if (Log.IsFatalEnabled)
        //    {
        //        Log.Fatal(message);
        //    }
        //}

        ///// <summary>
        ///// Member to provide Fatal level message logging
        ///// </summary>
        ///// <param name="message"></param>
        //public void Fatal(string format, string message)
        //{
        //    if (Log.IsFatalEnabled)
        //    {
        //        message = string.Format(format, message);
        //        Log.Fatal(message);
        //    }
        //}
    }
}
