using ComplaintMGT.Abstractions;
using ComplaintMGT.Abstractions.DomainModels;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

namespace ComplaintMGT.Infrastructure.Email
{
    public class EmailPoster //: IEmailPoster
    {
        //private IAppSettingsService _appSettingsService;
        //private IDatabaseLoggerService _databaseLoggerService;
        //private readonly IUserContext _userContext;
        //private readonly ILogger _logger;
        //public EmailPoster(
        //    IAppSettingsService appSettingsService,
        //    IDatabaseLoggerService databaseLoggerService,
        //    IUserContext userContext,
        //    ILogger logger  
        //    )
        //{
            
        //    _appSettingsService = appSettingsService;
        //    _databaseLoggerService = databaseLoggerService;
        //    _userContext = userContext;
        //    _logger = logger;
        //}
        //private enum MailAddressType
        //{
        //    IsTo = 0,
        //    IsCC = 1
        //}
        //public async Task<Object> Send(string body, string toName)
        //{
        //    var smtpPort = _appSettingsService.getSMTPPort();
        //    var smtpClient = new SmtpClient();
        //    MailMessage mailMessage = new MailMessage();
        //    await smtpClient.SendMailAsync(mailMessage);
        //    return true;
        //}

        //private bool SendMail(string emailbody, string subject, string[] to, string[] cc, bool IsHtml, string[] bcc = null, string attachmentFilename = null)
        //{
        //    MailMessage mailMessage = new MailMessage();
        //    EmailLogs emailLog = new EmailLogs();
        //    var originalSynchronizationContext = SynchronizationContext.Current;
        //    try
        //    {
        //        IsHtml = true;
        //        _logger.Info("Inside EmailPoster.CS : SendMail");
        //        //Default Initialization, it will be overwritten by Config value
        //        string defaultFromAddress = _appSettingsService.getEMAILFROM();
        //        string enableEmailFlag = _appSettingsService.getenableEmailFlag();
        //        string enableDevQAEmailFlag = _appSettingsService.getenableDevQAEmailFlag();
        //        string whitelistedEmail = _appSettingsService.getwhitelistedEmail();
        //        string smtpServerUrl = _appSettingsService.getSMTPServerUrl();
        //        string smtpPort = _appSettingsService.getSMTPPort();
        //        SmtpClient smtpClient = new SmtpClient(smtpServerUrl);
        //        mailMessage.Subject = subject;
        //        emailLog.Subject = subject;
        //        _logger.Info("Constructing Mail Components");
        //        smtpClient.Port = Int32.Parse(smtpPort);
        //        smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
        //        smtpClient.Host = smtpServerUrl;
        //        smtpClient.Host = smtpServerUrl;
        //        smtpClient.Port = Int32.Parse(smtpPort);
        //        _logger.Info("Constructing Mail Components");
        //        emailLog.Body = emailbody;
        //        mailMessage.From = new MailAddress(defaultFromAddress, "Navigator365 Notifications");

        //        if (IsHtml)
        //            mailMessage.IsBodyHtml = true;

        //        AlternateView htmlView = AlternateView.CreateAlternateViewFromString(emailbody, null, "text/html");

        //        LinkedResource ericssonLogoImage = new LinkedResource(_userContext.GetServerPath("resources/images/ericsson_logo.png"));
        //        ericssonLogoImage.ContentId = "ericsson_logo";
        //        htmlView.LinkedResources.Add(ericssonLogoImage);

        //        LinkedResource navigatorLogoImage = new LinkedResource(_userContext.GetServerPath("resources/images/navigator_365_logo.png"));
        //        navigatorLogoImage.ContentId = "navigator_365_logo";
        //        htmlView.LinkedResources.Add(navigatorLogoImage);

        //        if (emailbody.Contains("facebook"))
        //        {
        //            LinkedResource facebookLogoImage = new LinkedResource(_userContext.GetServerPath("resources/images/facebook_logo.png"));
        //            facebookLogoImage.ContentId = "facebook_logo";
        //            htmlView.LinkedResources.Add(facebookLogoImage);
        //        }
        //        if (emailbody.Contains("linkedin"))
        //        {
        //            LinkedResource linkedinLogoImage = new LinkedResource(_userContext.GetServerPath("resources/images/linkedin_logo.png"));
        //            linkedinLogoImage.ContentId = "linkedin_logo";
        //            htmlView.LinkedResources.Add(linkedinLogoImage);
        //        }
        //        if (emailbody.Contains("twitter"))
        //        {
        //            LinkedResource twitterLogoImage = new LinkedResource(_userContext.GetServerPath("resources/images/twitter_logo.png"));
        //            twitterLogoImage.ContentId = "twitter_logo";
        //            htmlView.LinkedResources.Add(twitterLogoImage);
        //        }
        //        mailMessage.AlternateViews.Add(htmlView);

        //        if (attachmentFilename != null)
        //        {
        //            Attachment attachment = new Attachment(attachmentFilename, MediaTypeNames.Application.Octet);
        //            ContentDisposition disposition = attachment.ContentDisposition;
        //            disposition.CreationDate = File.GetCreationTime(attachmentFilename);
        //            disposition.ModificationDate = File.GetLastWriteTime(attachmentFilename);
        //            disposition.ReadDate = File.GetLastAccessTime(attachmentFilename);
        //            disposition.FileName = Path.GetFileName(attachmentFilename);
        //            disposition.Size = new FileInfo(attachmentFilename).Length;
        //            disposition.DispositionType = DispositionTypeNames.Attachment;
        //            mailMessage.Attachments.Add(attachment);
        //        }
        //        if (enableEmailFlag.ToLower() == "y")
        //        {
        //            emailLog.EnableEmailFlag = true;
        //            if (to != null)
        //            {
        //                emailLog.AddressTo = string.Join(",", to);
        //                foreach (string s in to)
        //                {
        //                    if (!string.IsNullOrEmpty(s))
        //                    {
        //                        if (s.Contains(";"))
        //                        {
        //                            string[] emails = s.Split(';');
        //                            foreach (string email in emails)
        //                            {
        //                                if (!string.IsNullOrEmpty(email))
        //                                    mailMessage.To.Add(new MailAddress(email));
        //                            }
        //                        }
        //                        else
        //                        {
        //                            mailMessage.To.Add(new MailAddress(s));
        //                        }
        //                    }
        //                }
        //            }
        //            if (cc != null)
        //            {
        //                emailLog.AddressCC = string.Join(",", cc);
        //                foreach (string s in cc)
        //                {
        //                    if (!string.IsNullOrEmpty(s))
        //                    {
        //                        if (s.Contains(";"))
        //                        {
        //                            string[] emails = s.Split(';');
        //                            foreach (string email in emails)
        //                            {
        //                                if (!string.IsNullOrEmpty(email))
        //                                    mailMessage.CC.Add(new MailAddress(email));
        //                            }
        //                        }
        //                        else
        //                        {
        //                            mailMessage.CC.Add(new MailAddress(s));
        //                        }
        //                    }
        //                }
        //            }
        //            if (bcc != null)
        //            {
        //                emailLog.AddressBCC = string.Join(",", bcc);
        //                foreach (string s in bcc)
        //                {
        //                    if (!string.IsNullOrEmpty(s))
        //                    {
        //                        if (s.Contains(";"))
        //                        {
        //                            string[] emails = s.Split(';');
        //                            foreach (string email in emails)
        //                            {
        //                                if (!string.IsNullOrEmpty(email))
        //                                    mailMessage.Bcc.Add(new MailAddress(email));
        //                            }
        //                        }
        //                        else
        //                        {
        //                            mailMessage.Bcc.Add(new MailAddress(s));
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //        else if (enableDevQAEmailFlag.ToLower() == "y")
        //        {
        //            emailLog.EnableDevQAEmailFlag = true;
        //            emailLog.AddressCC = "";
        //            emailLog.AddressTo = "";
        //            string[] whitelistedEmails = whitelistedEmail.ToLower().Split(';');

        //            if (to != null)
        //            {
        //                foreach (string s in to)
        //                {
        //                    if (s == null)
        //                        continue;

        //                    if (s.Contains(";"))
        //                    {
        //                        string[] emails = s.Split(';');
        //                        foreach (string email in emails)
        //                        {
        //                            if (!string.IsNullOrEmpty(email) && whitelistedEmails.Contains(email.ToLower()))
        //                                mailMessage.To.Add(new MailAddress(email));
        //                        }
        //                    }
        //                    else
        //                    {
        //                        if (!string.IsNullOrEmpty(s) && whitelistedEmails.Contains(s.ToLower()))
        //                            mailMessage.To.Add(new MailAddress(s));
        //                    }
        //                }
        //            }
        //            if (cc != null)
        //            {
        //                foreach (string s in cc)
        //                {
        //                    if (s == null)
        //                        continue;

        //                    if (s.Contains(";"))
        //                    {
        //                        string[] emails = s.Split(';');
        //                        foreach (string email in emails)
        //                        {
        //                            if (!string.IsNullOrEmpty(email) && whitelistedEmails.Contains(email.ToLower()))
        //                                mailMessage.CC.Add(new MailAddress(email));
        //                        }
        //                    }
        //                    else
        //                    {
        //                        if (!string.IsNullOrEmpty(s) && whitelistedEmails.Contains(s.ToLower()))
        //                            mailMessage.CC.Add(new MailAddress(s));
        //                    }
        //                }
        //            }
        //            if (bcc != null)
        //            {
        //                foreach (string s in bcc)
        //                {
        //                    if (s == null)
        //                        continue;

        //                    if (s.Contains(";"))
        //                    {
        //                        string[] emails = s.Split(';');
        //                        foreach (string email in emails)
        //                        {
        //                            if (!string.IsNullOrEmpty(email) && whitelistedEmails.Contains(email.ToLower()))
        //                                mailMessage.Bcc.Add(new MailAddress(email));
        //                        }
        //                    }
        //                    else
        //                    {
        //                        if (!string.IsNullOrEmpty(s) && whitelistedEmails.Contains(s.ToLower()))
        //                            mailMessage.Bcc.Add(new MailAddress(s));
        //                    }
        //                }
        //            }

        //            if (mailMessage.To.Count > 0 || mailMessage.CC.Count > 0 || mailMessage.Bcc.Count > 0)
        //            {
        //                var removeToAddress = mailMessage.To.Where(x => whitelistedEmails.Where(y => y == x.Address).FirstOrDefault() == null).ToList();
        //                if (removeToAddress != null && removeToAddress.Count > 0)
        //                {
        //                    foreach (MailAddress m in removeToAddress)
        //                        mailMessage.To.Remove(m);
        //                }

        //                if (mailMessage.To.Count > 0)
        //                {
        //                    emailLog.AddressTo = string.Join(",", mailMessage.To);
        //                }

        //                var removeCCAddress = mailMessage.CC.Where(x => whitelistedEmails.Where(y => y == x.Address).FirstOrDefault() == null).ToList();
        //                if (removeCCAddress != null && removeCCAddress.Count > 0)
        //                {
        //                    foreach (MailAddress m in removeCCAddress)
        //                        mailMessage.CC.Remove(m);
        //                }
        //                if (mailMessage.CC.Count > 0)
        //                {
        //                    emailLog.AddressCC = string.Join(",", mailMessage.CC);
        //                }

        //                var removeBCCAddress = mailMessage.Bcc.Where(x => whitelistedEmails.Where(y => y == x.Address).FirstOrDefault() == null).ToList();
        //                if (removeBCCAddress != null && removeBCCAddress.Count > 0)
        //                {
        //                    foreach (MailAddress m in removeBCCAddress)
        //                        mailMessage.Bcc.Remove(m);
        //                }
        //                if (mailMessage.Bcc.Count > 0)
        //                {
        //                    emailLog.AddressBCC = string.Join(",", mailMessage.Bcc);
        //                }
        //            }
        //        }
        //        if (mailMessage.To.Count > 0 || mailMessage.CC.Count > 0 || mailMessage.Bcc.Count > 0)
        //        {
        //            SynchronizationContext.SetSynchronizationContext(null);
        //            //mailMessage.To.Add(new MailAddress("sudhanshu.a@ericsson.com"));
        //            //smtpClient.Send(mailMessage);
        //            smtpClient.SendMailAsync(mailMessage);
        //            _databaseLoggerService.SaveEmailLogs(emailLog, null);
        //            emailLog.MailSentFlag = true;
        //        }
        //        else
        //        {
        //            emailLog.MailSentFlag = false;
        //        }
        //        smtpClient.SendCompleted += (s, e) =>
        //        {
        //            smtpClient.Dispose();
        //            mailMessage.Dispose();
        //        };
        //        //smtpClient.Dispose();
        //        //mailMessage.Dispose();
        //        // _databaseLoggerService.SaveEmailLogs(emailLog, null);
        //        return emailLog.MailSentFlag;
        //    }
        //    catch (Exception e)
        //    {
        //        _logger.Error("Inside EmailPoster.CS : SendMail error " + e.Message);
        //        emailLog.MailSentFlag = false;
        //        _databaseLoggerService.SaveEmailLogs(emailLog, e);
        //        return false;
        //    }
        //    finally
        //    {
        //        SynchronizationContext.SetSynchronizationContext(originalSynchronizationContext);
        //    }
        //}
        //public bool SendAsetRejectionNotificationAssetOwner(string body,
        //                                                    string assetName,
        //                                                    string currentUserEmail,
        //                                                    string PratitionerEmail,
        //                                                    string CoProposerEmail,
        //                                                    string OwnerEmail,
        //                                                    string MailSubject)
        //{
        //    try
        //    {
        //        _logger.Info("Inside SendRejectionEmailToAssetOwner");
        //        List<string> ccAddress = new List<string>();
        //        List<string> toAddress = new List<string>();

        //        if (!string.IsNullOrEmpty(CoProposerEmail))
        //        {
        //            toAddress.Add(CoProposerEmail.Trim());
        //        }
        //        if (!string.IsNullOrEmpty(OwnerEmail))
        //        {
        //            toAddress.Add(OwnerEmail.Trim());
        //        }
        //        if (!string.IsNullOrEmpty(PratitionerEmail))
        //        {
        //            toAddress.Add(PratitionerEmail.Trim());
        //        }

        //        if (!string.IsNullOrEmpty(currentUserEmail))
        //        {
        //            ccAddress.Add(currentUserEmail);
        //        }

        //        if (toAddress.Count() > 0 || ccAddress.Count() > 0)
        //        {
        //            SendMail(body, "Action: Navigator365 | " + MailSubject + ": " + assetName,
        //                     toAddress.Count > 0 ? toAddress.ToArray() : null,
        //                     ccAddress.Count > 0 ? ccAddress.ToArray() : null,
        //                     false);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("Inner Exception In Mail Send: " + ex.InnerException);
        //        _logger.Error("Stack Trace Exception: " + ex.StackTrace);
        //        _logger.Error("Exception Message : " + ex.Message);
        //        _logger.Error("Target Site" + ex.TargetSite);
        //        _logger.Error("Exception: " + ex.GetBaseException());
        //    }
        //    return true;
        //}
    }
}
