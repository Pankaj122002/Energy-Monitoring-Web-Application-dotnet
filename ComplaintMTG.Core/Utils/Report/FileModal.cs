using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Core.Utils.Report
{
	public class FileModal
	{
		public string FileName { get; set; }
		public string PdfFileName { get; set; }
		public string ReportUrl { get; set; }
		public string Dated { get; set; }
		public string txtFDate { get; set; }
		public string txtTDate { get; set; }
		public string ddlAsset { get; set; }
		public string ExcelBase64 { get; set; }
		public string PdfBase64 { get; set; }

	}
}
