using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.GENERIC
{
   public class MailTmpInfo
    {
        public string Receiver { get; set; }
        public string SendType { get; set; }
        public string NotificationType { get; set; }
        public string SubjectDesc { get; set; }
        public string MailDisplayDesc { get; set; }
        public string MailDirectory { get; set; }
        public string MailFile { get; set; }
    }
}
