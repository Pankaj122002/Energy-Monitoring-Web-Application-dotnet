//using SelectPdf;
using System;
using System.Collections.Generic;
using System.Text;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace ComplaintMGT.Core.Utils.Report
{
    public class PdfReport
    {
        public byte[] ExportToPdfData(string txttbl, string Name, string FPath)
        {
            byte[] Response = null;
            try
            {
                string PrintDatetime = "Print: " + " " + " " + DateTime.Now.ToString("dd/MM/yy hh:mm:ss tt");
                string StrContent = "";
                System.Text.StringBuilder htmlContent = new System.Text.StringBuilder();
                string line;

                //StreamReader reader = new StreamReader(Server.MapPath("~/Files/sample-invoice.html"));
                using (System.IO.StreamReader htmlReader = new System.IO.StreamReader(FPath))
                {

                    while ((line = htmlReader.ReadLine()) != null)
                    {
                        htmlContent.Append(line);
                    }
                }


                StrContent = htmlContent.ToString();

                StrContent = StrContent.Replace("[RHeading]", Name);
                StrContent = StrContent.Replace("[PrintDate]", PrintDatetime);
                StrContent = StrContent.Replace("[lstTBody]", txttbl);

                // instantiate a html to pdf converter object
                //HtmlToPdf converter = new HtmlToPdf();

                //// set converter options
                //converter.Options.PdfPageSize = PdfPageSize.A4;
                //converter.Options.MarginTop = 20;
                //converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
                //SelectPdf.PdfDocument doc = converter.ConvertHtmlString(StrContent);

                // save pdf document
                //Response = doc.Save();


                //doc.Close();
            }
            catch (Exception ex)
            {

            }
            return Response;

        }
    }
}
