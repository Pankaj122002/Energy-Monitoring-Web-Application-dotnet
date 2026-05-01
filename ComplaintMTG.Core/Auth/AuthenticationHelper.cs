using System;
using System.Security;
using ComplaintMGT.Abstractions.Auth;
//using System.DirectoryServices;
using ComplaintMGT.Abstractions;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.DomainModels;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace ComplaintMGT.Core.Auth
{
    public class AuthenticationHelper //: ILdapAuthenticatorService
    {
        public static bool Authenticate(string userName, SecureString password, string domain)
        {

            //if (NativeMethods.LogonUser(userName, domain, secureStringConverter.ConvertFrom(password),
            //    (int)LogonType.LOGON32_LOGON_NETWORK,
            //    (int)LogonProvider.LOGON32_PROVIDER_DEFAULT, out NativeMethods.SafeTokenHandle userToken))
            //{
            //    userToken.Dispose();
            //    return true;
            //}

            return false;
        }

        public static Tuple<string, string> ExtractDomainAndUserName(string userName)
        {
            if (String.IsNullOrWhiteSpace(userName))
            {
                return new Tuple<string, string>("", "");
            }
            var userNameParts = userName.Split(new[] { '\\' }, 2);
            var user = userNameParts.Length > 1 ? userNameParts[1].Trim() : userName.Trim();
            var domainName = userNameParts.Length > 1 ? userNameParts[0].Trim() : Environment.UserDomainName;
            return new Tuple<string, string>(domainName, user);
        }

        /// <summary>
        /// Method will return null if there is any exception 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public void CheckAuthenticate(string username, string password)
        {
            try
            {
                //return CheckAuthenticateCommonMethod(username, password);
            }
            catch (Exception)
            {
                //return null;
            }
        }

        /// <summary>
        /// CheckAuthenticateWithExceptionHandling  with created over  CheckAuthenticateWith. 
        /// Created because exisiting method used in many places and perform Exception Handling will required lot of code changes
        /// This method will Return Exception in case of faliure.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        //public SearchResult CheckAuthenticateWithExceptionHandling(string username, string password)
        //{
        //    try
        //    {
        //        return CheckAuthenticateCommonMethod(username, password);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        ///// <summary>
        ///// Use this method and implement try catch at method level not in this method.
        ///// </summary>
        ///// <param name="username"></param>
        ///// <param name="password"></param>
        ///// <returns></returns>
        //private static SearchResult CheckAuthenticateCommonMethod(string username, string password)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //    string domainAndAccountName = Constants.ERICSSON_DOMAIN + @"\" + username;

        //    DirectoryEntry entry = null;
        //    if (!string.IsNullOrWhiteSpace(password))
        //        entry = new DirectoryEntry(path, domainAndAccountName, password, AuthenticationTypes.SecureSocketsLayer);
        //    else
        //        entry = new DirectoryEntry(path);

        //    DirectorySearcher search = new DirectorySearcher(entry)
        //    {
        //        Filter = "(SAMAccountName=" + username + ")"
        //    };
        //    SearchResult result = search.FindOne();
        //    if (result != null)
        //    {
        //        return result;
        //    }
        //    else return null;
        //}

        //public AuthenticationResult Authenticate(LoginRequest loginRequest)
        //{
        //    AuthenticationResult authResult = new AuthenticationResult();
        //    try
        //    {
        //        SearchResult result = CheckAuthenticateWithExceptionHandling(loginRequest.Username, loginRequest.Password);
        //        if (result != null)
        //        {
        //            authResult.LDAPRoles = (object[])result.GetDirectoryEntry().Properties["memberOf"].Value;
        //            authResult.Username = (string)result.GetDirectoryEntry().Properties["givenname"].Value;
        //            authResult.DisplayName = (string)result.GetDirectoryEntry().Properties["displayname"].Value;
        //            authResult.Mail = (string)result.GetDirectoryEntry().Properties["mail"].Value;
        //            authResult.UserId = loginRequest.Username;
        //            authResult.Success = true;
        //        }
        //        else { authResult.Success = false; }
        //        return authResult;
        //    }
        //    catch (Exception e)
        //    {
        //        authResult.Success = false;
        //        authResult.Message = e.Message;
        //        return authResult;
        //    }
        //}
        //public SearchResult CheckAuthenticateUserSignum(string username)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;


        //    DirectoryEntry entry = new DirectoryEntry(path);

        //    try
        //    {
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(SAMAccountName=" + username + ")"
        //        };
        //        SearchResult result = search.FindOne();
        //        if (result != null)
        //        {
        //            return result;
        //        }
        //        else
        //        {
        //            //check user by email
        //            search = new DirectorySearcher(entry)
        //            {
        //                Filter = "(mail=" + username + ")"
        //            };
        //            result = search.FindOne();
        //            if (result != null)
        //            {
        //                return result;
        //            }
        //            else
        //                return null;
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
        //public string CheckUserSignumOrName(string signumOrName)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //    signumOrName = signumOrName.TrimStart().TrimEnd();
        //    DirectoryEntry entry = new DirectoryEntry(path);
        //    try
        //    {
        //        //check user by signum
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(SAMAccountName=" + signumOrName + ")"
        //        };
        //        SearchResult result = search.FindOne();
        //        if (result != null)
        //        {
        //            if (result.GetDirectoryEntry().Properties["member"] != null)
        //            {
        //                object obj = result.GetDirectoryEntry().Properties["member"].Value;
        //                if (obj != null)
        //                {
        //                    string listofmembers = "";
        //                    foreach (var info in ((object[])obj))
        //                    {
        //                        string signum = info.ToString().Substring((info.ToString().IndexOf("CN=") + 3), (info.ToString().IndexOf(",") - (info.ToString().IndexOf("CN=") + 3)));
        //                        if (signum != "")
        //                        {
        //                            listofmembers = listofmembers + CheckUserSignumOrName(signum) + ";";
        //                        }
        //                    }
        //                    return listofmembers;
        //                }
        //                else
        //                {
        //                    return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                    "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //                }
        //            }
        //            else
        //            {
        //                return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //            }
        //        }
        //        else
        //        {
        //            //check user by name
        //            search = new DirectorySearcher(entry)
        //            {
        //                Filter = "(displayname=" + signumOrName + ")"
        //            };
        //            result = search.FindOne();
        //            if (result != null)
        //            {
        //                if (result.GetDirectoryEntry().Properties["member"] != null)
        //                {
        //                    object obj = result.GetDirectoryEntry().Properties["member"].Value;
        //                    if (obj != null)
        //                    {
        //                        string listofmembers = "";
        //                        foreach (var info in ((object[])obj))
        //                        {
        //                            string signum = info.ToString().Substring((info.ToString().IndexOf("CN=") + 3), (info.ToString().IndexOf(",") - (info.ToString().IndexOf("CN=") + 3)));
        //                            if (signum != "")
        //                            {
        //                                listofmembers = listofmembers + CheckUserSignumOrName(signum) + ";";
        //                            }
        //                        }
        //                        return listofmembers;
        //                    }
        //                    else
        //                    {
        //                        return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                        "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //                    }
        //                }
        //                else
        //                {
        //                    return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                    "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //                }
        //            }
        //            else
        //            {
        //                search = new DirectorySearcher(entry)
        //                {
        //                    Filter = "(mail=" + signumOrName + ")"
        //                };
        //                result = search.FindOne();
        //                if (result != null)
        //                {
        //                    if (result.GetDirectoryEntry().Properties["member"] != null)
        //                    {
        //                        object obj = result.GetDirectoryEntry().Properties["member"].Value;
        //                        if (obj != null)
        //                        {
        //                            string listofmembers = "";
        //                            foreach (var info in ((object[])obj))
        //                            {
        //                                string signum = info.ToString().Substring((info.ToString().IndexOf("CN=") + 3), (info.ToString().IndexOf(",") - (info.ToString().IndexOf("CN=") + 3)));
        //                                if (signum != "")
        //                                {
        //                                    listofmembers = listofmembers + CheckUserSignumOrName(signum) + ";";
        //                                }
        //                            }
        //                            return listofmembers;
        //                        }
        //                        else
        //                        {
        //                            return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                            "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //                        }
        //                    }
        //                    else
        //                    {
        //                        return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() +
        //                        "(" + result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper() + ")";
        //                    }
        //                }
        //                else
        //                    return null;
        //            }
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
        //public List<NameValueModel> GetUsersBySignumOrName(string signumOrName)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //    signumOrName = signumOrName.Trim();
        //    DirectoryEntry entry = new DirectoryEntry(path);
        //    try
        //    {
        //        //check user by signum
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(|(&(objectcategory=user)(SAMAccountName=*" + signumOrName + "*))(&(objectcategory=user)(displayname=*" + signumOrName + "*)))"
        //        };

        //        SearchResultCollection resultCollection = search.FindAll();
        //        List<string> signums = new List<string>();
        //        List<NameValueModel> users = new List<NameValueModel>();

        //        if (resultCollection != null && resultCollection.Count > 0)
        //        {
        //            foreach (SearchResult r in resultCollection)
        //            {
        //                try
        //                {
        //                    NameValueModel user = new NameValueModel();

        //                    var name = r.GetDirectoryEntry().Properties["displayname"].Value.ToString(); ;
        //                    var value = r.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper();
        //                    if (value != null && !signums.Contains(value) && value.Length <= 7)
        //                    {
        //                        user.Name = name;
        //                        user.Value = value;
        //                        signums.Add(value);
        //                        users.Add(user);
        //                    }
        //                }
        //                catch (Exception)
        //                {

        //                }
        //            }
        //            return users;
        //        }

        //        else
        //            return null;

        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
        //public EmployeeDetails GetUserDetails(string signumOrName)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //    signumOrName = signumOrName.TrimStart().TrimEnd();
        //    DirectoryEntry entry = new DirectoryEntry(path);
        //    EmployeeDetails employeeDetails = null;
        //    try
        //    {
        //        //check user by signum
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(SAMAccountName=" + signumOrName + ")"
        //        };
        //        SearchResult result = search.FindOne();
        //        if (result != null)
        //        {
        //            employeeDetails = new EmployeeDetails();
        //            employeeDetails.Name = result.GetDirectoryEntry().Properties["displayname"].Value.ToString();
        //            employeeDetails.signum = result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper();
        //        }
        //        else
        //        {
        //            //check user by name
        //            search = new DirectorySearcher(entry)
        //            {
        //                Filter = "(displayname=" + signumOrName + ")"
        //            };
        //            result = search.FindOne();
        //            if (result != null)
        //            {
        //                employeeDetails = new EmployeeDetails();
        //                employeeDetails.Name = result.GetDirectoryEntry().Properties["displayname"].Value.ToString();
        //                employeeDetails.signum = result.GetDirectoryEntry().Properties["SAMAccountName"].Value.ToString().ToUpper();
        //            }
        //        }

        //        return employeeDetails;
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}

        //public SearchResultCollection CheckAuthenticationUserSignums(string[] usernames)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;

        //    DirectoryEntry entry = new DirectoryEntry(path);
        //    try
        //    {
        //        string filter = "";
        //        foreach (string username in usernames)
        //        {
        //            if (username != null && username != "")
        //                filter = filter + "(sAMAccountName=" + username + ")";
        //        }
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(|" + filter + ")"
        //        };
        //        SearchResultCollection resultCollection = search.FindAll();
        //        if (resultCollection.Count > 0)
        //        {
        //            return resultCollection;
        //        }
        //        else
        //            return null;
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}

        //public string GetSignumFromUsernameSignum(String usernameSignum)
        //{
        //    if (usernameSignum != null)
        //    {
        //        usernameSignum = usernameSignum.Contains("-") ? usernameSignum.Substring(usernameSignum.LastIndexOf("-") + 2) : usernameSignum;
        //        usernameSignum = usernameSignum.Trim();
        //    }
        //    return usernameSignum;
        //}


        //public string GetUsernameSignumFromSignum(String signum)
        //{
        //    try
        //    {
        //        string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //        DirectoryEntry entry = new DirectoryEntry(path);
        //        SearchResult result = null;
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(SAMAccountName=" + signum + ")"
        //        };
        //        result = search.FindOne();
        //        if (result != null && result.GetDirectoryEntry().Properties["givenname"] != null)
        //            return result.GetDirectoryEntry().Properties["displayname"].Value.ToString() + " - " + signum;
        //        else return signum;
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
        //public string GetEmailInfo(string username)
        //{
        //    try
        //    {
        //        return !string.IsNullOrEmpty(username) ? CheckAuthenticate(username, null).GetDirectoryEntry().Properties["mail"].Value.ToString() : "";
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}

        //public SearchResultCollection CheckUserByManagerSignum(string username)
        //{
        //    string path = "LDAP://" + Constants.ERICSSON_DOMAIN_FOR_LADP;
        //    DirectoryEntry entry = new DirectoryEntry(path);

        //    try
        //    {
        //        DirectorySearcher search = new DirectorySearcher(entry)
        //        {
        //            Filter = "(objectcategory=user)"
        //        };
        //        SearchResultCollection result = search.FindAll();
        //        if (result != null)
        //        {
        //            return result;
        //        }
        //        return null;
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
    }
}
