using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;

namespace ComplaintMGT.Core.Utils.Report
{
    public class ExcelReport
    {
        public byte[] ExportGetHVACData(string lst, string Name)
        {
            JArray jresult = JArray.Parse(lst);
           
            byte[] Response = null;
            try
            {
                using (ExcelPackage excel = new ExcelPackage())
                {
                    int Count = 1;
                    //int Count = 1;
                    int RowCount = 5;
                    excel.Workbook.Properties.Author = "syntecsys.com";
                    excel.Workbook.Properties.Title = Name + DateTime.Now.ToString("MMMM");

                    string currtdate = "Print" + " " + " " + DateTime.Now.ToString("dd/MM/yy hh:mm:ss tt");
                    ExcelWorksheet worksheet = excel.Workbook.Worksheets.Add(Name);

                    #region Creating Header
                    worksheet.Cells[1, 1, 1, 10].Value = Name;
                    worksheet.Cells[1, 1, 2, 10].Merge = true;

                    worksheet.Cells[3, 5, 3, 10].Value = currtdate;
                    worksheet.Cells[3, 5, 3, 10].Merge = true;

                    worksheet.Cells[4, 1].Value = "Sr No.";
                    worksheet.Cells[4, 2].Value = "Country"; worksheet.Column(2).Width = 15;
                    worksheet.Cells[4, 3].Value = "State"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 4].Value = "City"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 5].Value = "Zone"; worksheet.Column(4).Width = 15;
                    worksheet.Cells[4, 6].Value = "Site"; worksheet.Column(5).Width = 15;
                    worksheet.Cells[4, 7].Value = "Asset"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 8].Value = "Date"; worksheet.Column(7).Width = 22;
                    worksheet.Cells[4, 9].Value = "Time"; worksheet.Column(8).Width = 22;
                    worksheet.Cells[4, 10].Value = "Temperature"; worksheet.Column(9).Width = 22;

                    #endregion



                    #region filling data

                    foreach (JObject item in jresult)
                    {
                       
                        worksheet.Cells[RowCount, 1].Value = Count;
                        worksheet.Cells[RowCount, 2].Value = "";
                        worksheet.Cells[RowCount, 3].Value = "";
                        worksheet.Cells[RowCount, 4].Value = "";
                        worksheet.Cells[RowCount, 5].Value = "";
                        worksheet.Cells[RowCount, 6].Value = item.GetValue("SiteName").ToString();
                        worksheet.Cells[RowCount, 7].Value = item.GetValue("Asset").ToString();
                        worksheet.Cells[RowCount, 8].Value = item.GetValue("TDAte").ToString();
                        worksheet.Cells[RowCount, 9].Value = item.GetValue("TTime").ToString();
                        worksheet.Cells[RowCount, 10].Value = item.GetValue("Temp_in_degree").ToString();
                        worksheet.Cells[RowCount, 1, RowCount, 10].Style.WrapText = true;
                        worksheet.Cells[RowCount, 1, RowCount, 10].Style.ShrinkToFit = true;
                        worksheet.Cells[RowCount, 1, RowCount, 10].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        worksheet.Cells[RowCount, 1, RowCount, 10].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        Count++;
                        RowCount++;
                    }
                    #endregion

                    //#region footer
                    //if (jresult.Count > 0)
                    //{
                    //    // worksheet.Cells[RowCount, 1].Value = Count;
                    //    //  worksheet.Cells[RowCount, 2].Value = item.GetValue("CreatedOn").ToString();
                    //    // worksheet.Cells[RowCount, 3].Value = item.GetValue("VehicleNo").ToString();
                    //    worksheet.Cells[RowCount, 1, RowCount, 4].Value = "Total";
                    //    worksheet.Cells[RowCount, 5].Value = "ON LOAD(In Kgs)";
                    //    worksheet.Cells[RowCount, 6].Value = GrossWeight;
                    //    worksheet.Cells[RowCount, 7].Value = "OFF LOAD(In Kgs)";
                    //    worksheet.Cells[RowCount, 8].Value = vehicleWeightInKg;
                    //    worksheet.Cells[RowCount, 9].Value = "LOAD COLLECTED (In Kgs)";
                    //    worksheet.Cells[RowCount, 10].Value = NetWaste;

                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.Font.Bold = true;
                    //    // Setting fill type soli
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //    // Setting background gray
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.Fill.BackgroundColor.SetColor(Color.Gray);
                    //    // Setting font color
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.Font.Color.SetColor(Color.Black);


                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.Font.Size = 12;
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.WrapText = true;
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.ShrinkToFit = true;
                    //    worksheet.Cells[RowCount, 1, RowCount, 10].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    //}
                    //RowCount = RowCount + 1;
                    //#endregion

                    #region formatting
                    using (var range = worksheet.Cells[3, 1, 4, 10])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);

                        range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }
                    using (var range = worksheet.Cells[1, 1, 3, 10])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);


                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }

                    worksheet.PrinterSettings.FitToPage = true;
                    worksheet.PrinterSettings.ShowGridLines = true;

                    #endregion

                    Response = excel.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
            }
            return Response;
        }
        public byte[] ExportGetEnergyData(string lst, string Name)
        {
            JArray jresult = JArray.Parse(lst);

            byte[] Response = null;
            try
            {
                using (ExcelPackage excel = new ExcelPackage())
                {
                    int Count = 1;
                    //int Count = 1;
                    List<string> averagecumm_en = new List<string>();
                    int RowCount = 5;
                    excel.Workbook.Properties.Author = "syntecsys.com";
                    excel.Workbook.Properties.Title = Name + DateTime.Now.ToString("MMMM");

                    string currtdate = "Print" + " " + " " + DateTime.Now.ToString("dd/MM/yy hh:mm:ss tt");
                    ExcelWorksheet worksheet = excel.Workbook.Worksheets.Add(Name);

                    #region Creating Header
                    worksheet.Cells[1, 1, 1, 15].Value = Name;
                    worksheet.Cells[1, 1, 2, 15].Merge = true;

                    worksheet.Cells[3, 5, 3, 15].Value = currtdate;
                    worksheet.Cells[3, 5, 3, 15].Merge = true;

                    worksheet.Cells[4, 1].Value = "Sr No.";
                    worksheet.Cells[4, 2].Value = "Country"; worksheet.Column(2).Width = 15;
                    worksheet.Cells[4, 3].Value = "State"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 4].Value = "City"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 5].Value = "Zone"; worksheet.Column(4).Width = 15;
                    worksheet.Cells[4, 6].Value = "Date"; worksheet.Column(4).Width = 15;
                    worksheet.Cells[4, 7].Value = "Outlet Name"; worksheet.Column(5).Width = 15;
                    worksheet.Cells[4, 8].Value = "Asset"; worksheet.Column(5).Width = 27;
                    worksheet.Cells[4, 9].Value = "Opnening Reading"; worksheet.Column(5).Width = 27;
                    worksheet.Cells[4, 10].Value = "Closing Reading"; worksheet.Column(5).Width = 27;
                   
                    worksheet.Cells[4, 11].Value = "Cumulative Energy(KWH)"; worksheet.Column(6).Width = 27;
                    worksheet.Cells[4, 12].Value = "Power Factor"; worksheet.Column(6).Width = 27;
                    worksheet.Cells[4, 13].Value = "KVAH"; worksheet.Column(6).Width = 27;
                    //worksheet.Cells[4, 13].Value = "Power R(KW)"; worksheet.Column(6).Width = 22;
                    //worksheet.Cells[4, 14].Value = "Power Y(KW)"; worksheet.Column(6).Width = 22;
                    //worksheet.Cells[4, 15].Value = "Power B(KW)"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 14].Value = "EB Run Hours(HR)"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 15].Value = "Total Power(KW)"; worksheet.Column(6).Width = 22;
                   
                  //  worksheet.Cells[4, 15].Value = "Time"; worksheet.Column(8).Width = 22;
                   


                    #endregion



                    #region filling data

                    foreach (JObject item in jresult)
                    {

                        worksheet.Cells[RowCount, 1].Value = Count;
                        worksheet.Cells[RowCount, 2].Value = "";
                        worksheet.Cells[RowCount, 3].Value = "";
                        worksheet.Cells[RowCount, 4].Value = "";
                        worksheet.Cells[RowCount, 5].Value = "";
                        worksheet.Cells[RowCount, 6].Value = item.GetValue("TDAte").ToString();
                        worksheet.Cells[RowCount, 7].Value = item.GetValue("SiteName").ToString();
                        worksheet.Cells[RowCount, 8].Value = item.GetValue("DeviceName").ToString();
                        worksheet.Cells[RowCount, 9].Value = decimal.Parse(item.GetValue("First_cumm_en").ToString());
                        worksheet.Cells[RowCount, 10].Value = decimal.Parse(item.GetValue("Last_cumm_en").ToString());
                        worksheet.Cells[RowCount, 11].Value = decimal.Parse(item.GetValue("toaltCumm").ToString());
                        worksheet.Cells[RowCount, 12].Value = decimal.Parse(item.GetValue("pow_fac").ToString());
                        worksheet.Cells[RowCount, 13].Value = decimal.Parse(item.GetValue("calc_kvah").ToString());
                        //worksheet.Cells[RowCount, 13].Value = decimal.Parse(item.GetValue("pow_r").ToString());
                        //worksheet.Cells[RowCount, 14].Value = decimal.Parse(item.GetValue("pow_y").ToString());
                        //worksheet.Cells[RowCount, 15].Value = item.GetValue("pow_b").ToString();
                        worksheet.Cells[RowCount, 14].Value = decimal.Parse(item.GetValue("run_hrs").ToString());
                        worksheet.Cells[RowCount, 15].Value = decimal.Parse(item.GetValue("total_pow").ToString());
                     
                     //   worksheet.Cells[RowCount, 15].Value = item.GetValue("TTime").ToString();
                    
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.WrapText = true;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.ShrinkToFit = true;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                       // averagecumm_en.Add(item.GetValue("cumm_en").ToString());
                        Count++;
                        RowCount++;
                    }
                    #endregion
                    //decimal sum = 0;
                    //for (int i = 0; i < averagecumm_en.Count; i++)
                    //{
                    //    sum += decimal.Parse(averagecumm_en[i]); // calculate the total
                    //}
                    //#region AVRAGE


                    //worksheet.Cells[RowCount, 7].Value = "Average";
                    //worksheet.Cells[RowCount, 8].Value = sum / averagecumm_en.Count; ;
                    //int Totalrow = RowCount + 1;
                    //int Trow = averagecumm_en.Count - 1;

                    //worksheet.Cells[Totalrow, 7].Value = "Total";
                    //worksheet.Cells[Totalrow, 8].Value = decimal.Parse(averagecumm_en[0]) - decimal.Parse(averagecumm_en[Trow]);



                    //#endregion

                    #region formatting
                    using (var range = worksheet.Cells[3, 1, 4, 15])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);

                        range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }
                    using (var range = worksheet.Cells[1, 1, 3, 15])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);


                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }

                    using (var range = worksheet.Cells[RowCount, 1, RowCount, 17])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);


                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }

                    worksheet.PrinterSettings.FitToPage = true;
                    worksheet.PrinterSettings.ShowGridLines = true;

                    #endregion

                    Response = excel.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
            }
            return Response;
        }
        public byte[] ExportGetEnergyDataDetails(string lst, string Name)
        {
            JArray jresult = JArray.Parse(lst);

            byte[] Response = null;
            try
            {
                using (ExcelPackage excel = new ExcelPackage())
                {
                    int Count = 1;
                    //int Count = 1;
                    List<string> averagecumm_en = new List<string>();
                    int RowCount = 5;
                    decimal actualrunHou = 0;
                    decimal ActualTotal = 0;
                    decimal ActualKavh = 0;
                    excel.Workbook.Properties.Author = "syntecsys.com";
                    excel.Workbook.Properties.Title = Name + DateTime.Now.ToString("MMMM");

                    string currtdate = "Print" + " " + " " + DateTime.Now.ToString("dd/MM/yy hh:mm:ss tt");
                    ExcelWorksheet worksheet = excel.Workbook.Worksheets.Add(Name);

                    #region Creating Header
                    worksheet.Cells[1, 1, 1, 13].Value = Name;
                    worksheet.Cells[1, 1, 2, 13].Merge = true;

                    worksheet.Cells[3, 5, 3, 13].Value = currtdate;
                    worksheet.Cells[3, 5, 3, 13].Merge = true;

                    worksheet.Cells[4, 1].Value = "Sr No.";
                    worksheet.Cells[4, 2].Value = "Country"; worksheet.Column(2).Width = 15;
                    worksheet.Cells[4, 3].Value = "State"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 4].Value = "City"; worksheet.Column(3).Width = 15;
                    worksheet.Cells[4, 5].Value = "Zone"; worksheet.Column(4).Width = 15;
                    worksheet.Cells[4, 6].Value = "Date"; worksheet.Column(4).Width = 15;
                    worksheet.Cells[4, 7].Value = "Outlet Name"; worksheet.Column(5).Width = 15;
                    worksheet.Cells[4, 8].Value = "Asset"; worksheet.Column(5).Width = 15;
                    worksheet.Cells[4, 9].Value = "Cumulative Energy(KWH)"; worksheet.Column(5).Width = 27;
                   
                   // worksheet.Cells[4, 10].Value = "Power R(KW)"; worksheet.Column(6).Width = 22;
                  //  worksheet.Cells[4, 11].Value = "Power Y(KW)"; worksheet.Column(6).Width = 22;
                   // worksheet.Cells[4, 12].Value = "Power B(KW)"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 10].Value = "Power Factor"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 11].Value = "KWH"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 12].Value = "KVAH"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 13].Value = "EB Run Hours(HR)"; worksheet.Column(6).Width = 22;
                    worksheet.Cells[4, 14].Value = "Total Power(KW)"; worksheet.Column(6).Width = 22;

                      worksheet.Cells[4, 15].Value = "Time"; worksheet.Column(8).Width = 22;



                    #endregion



                    #region filling data

                    foreach (JObject item in jresult)
                    {

                        worksheet.Cells[RowCount, 1].Value = Count;
                        worksheet.Cells[RowCount, 2].Value = "";
                        worksheet.Cells[RowCount, 3].Value = "";
                        worksheet.Cells[RowCount, 4].Value = "";
                        worksheet.Cells[RowCount, 5].Value = "";
                        worksheet.Cells[RowCount, 6].Value = item.GetValue("TDAte").ToString();
                        worksheet.Cells[RowCount, 7].Value = item.GetValue("SiteName").ToString();
                        worksheet.Cells[RowCount, 8].Value = item.GetValue("DeviceName").ToString();
                        worksheet.Cells[RowCount, 9].Value = decimal.Parse(item.GetValue("cumm_en").ToString());
                        
                        //worksheet.Cells[RowCount, 10].Value = decimal.Parse(item.GetValue("pow_r").ToString());
                        //worksheet.Cells[RowCount, 11].Value = decimal.Parse(item.GetValue("pow_y").ToString());
                        //worksheet.Cells[RowCount, 12].Value = item.GetValue("pow_b").ToString();
                        worksheet.Cells[RowCount, 10].Value = item.GetValue("pow_fac").ToString();
                        worksheet.Cells[RowCount, 11].Value = item.GetValue("KWH").ToString();
                        worksheet.Cells[RowCount, 12].Value = decimal.Parse(item.GetValue("calc_kvah").ToString());
                        worksheet.Cells[RowCount, 13].Value = decimal.Parse(item.GetValue("ACRUN_HRS").ToString());
                        worksheet.Cells[RowCount, 14].Value = decimal.Parse(item.GetValue("ToatalPWR").ToString());

                       worksheet.Cells[RowCount, 15].Value = item.GetValue("TTime").ToString();

                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.WrapText = true;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.ShrinkToFit = true;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        worksheet.Cells[RowCount, 1, RowCount, 15].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                         averagecumm_en.Add(item.GetValue("KWH").ToString());
                        ActualKavh += decimal.Parse(item.GetValue("calc_kvah").ToString());
                        actualrunHou += decimal.Parse(item.GetValue("ACRUN_HRS").ToString());
                        ActualTotal += decimal.Parse(item.GetValue("ToatalPWR").ToString());
                        Count++;
                        RowCount++;
                    }
                    #endregion
                    decimal sum = 0;
                    for (int i = 0; i < averagecumm_en.Count; i++)
                    {
                        sum += decimal.Parse(averagecumm_en[i]); // calculate the total
                    }
                    #region AVRAGE


                    worksheet.Cells[RowCount, 8].Value = "Average";
                    worksheet.Cells[RowCount, 9].Value = sum / averagecumm_en.Count; ;
                    int Totalrow = RowCount + 1;
                    int Trow = averagecumm_en.Count - 1;

                    worksheet.Cells[Totalrow, 8].Value = "Total";
                    worksheet.Cells[Totalrow, 9].Value = sum;
                    worksheet.Cells[Totalrow, 12].Value = ActualKavh;
                    worksheet.Cells[Totalrow, 13].Value = actualrunHou;
                    worksheet.Cells[Totalrow, 14].Value = ActualTotal;



                    #endregion

                    #region formatting
                    using (var range = worksheet.Cells[3, 1, 4, 15])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);

                        range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }
                    using (var range = worksheet.Cells[1, 1, 3, 15])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);


                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }

                    using (var range = worksheet.Cells[RowCount, 1, Totalrow, 15])
                    {
                        // Setting bold font
                        range.Style.Font.Bold = true;
                        // Setting fill type solid
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        // Setting background gray
                        range.Style.Fill.BackgroundColor.SetColor(Color.Goldenrod);
                        // Setting font color
                        range.Style.Font.Color.SetColor(Color.Black);


                        range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        range.Style.Font.Size = 12;
                        range.Style.WrapText = true;
                        range.Style.ShrinkToFit = true;
                        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                    }

                    worksheet.PrinterSettings.FitToPage = true;
                    worksheet.PrinterSettings.ShowGridLines = true;

                    #endregion

                    Response = excel.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
            }
            return Response;
        }
    }
}
