USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientThermalDashboardCompliance]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
-- =============================================  
-- Author:  Prasun Guchhait  
-- Create date: 31-03-2024  
-- Description: Stored Procedurer to get the compiance information for HVAC Devices  
-- =============================================  
CREATE PROCEDURE [dbo].[sp_GetAmbientThermalDashboardCompliance]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @DATEDIFF INT; 
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
  
  
 DROP TABLE IF EXISTS #DEVICE_COUNT  
 DROP TABLE IF EXISTS #COMPLIANCE_DATA  
  
 CREATE TABLE #DEVICE_COUNT (DeviceId VARCHAR(30), DeviceCount INT)  
 CREATE TABLE #COMPLIANCE_DATA (Device varchar(100), NonComplience VARCHAR(100))  
  
 INSERT INTO #DEVICE_COUNT  
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 --WHERE AST.[Description] = 'HVAC' AND CAST(AL.[ReportDate] AS DATE) >= CAST(GETDATE()-@days AS DATE)  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE 
-- AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.DeviceId  
  
 INSERT INTO #COMPLIANCE_DATA  
 SELECT ASS.Name AS DisplayName,    
 CAST(((((CAST((SUM(D.DeviceCount)*2) AS DECIMAL))/60)*100)/(24 * (@DATEDIFF+1))) AS DECIMAL(10, 2)) AS CO  
 FROM #DEVICE_COUNT D  
 LEFT JOIN dbo.[tbl_DeviceDetails] DD ON D.DeviceId=DD.DeviceIdForExternal   
 LEFT JOIN [dbo].[tbl_Asset] ASS ON DD.[AssetId]=ASS.AssetId   
 --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY ASS.Name, D.DeviceId  
  
 SELECT Device, NonComplience,CAST((100-CAST(NonComplience AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance   
 FROM #COMPLIANCE_DATA  
 
  
 DROP TABLE #DEVICE_COUNT  
 DROP TABLE  #COMPLIANCE_DATA  
END  








GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientThermalDashboardAlerts]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================  
CREATE PROCEDURE [dbo].[sp_GetAmbientThermalDashboardAlerts]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (
	--SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser_V2(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @Notifications INT = 0  
 DECLARE @Deviations INT = 0  
 DECLARE @Alerts INT = 0  
 DROP TABLE IF EXISTS #temp  
 CREATE TABLE #temp (device VARCHAR(30),countt INT)  
 INSERT INTO #temp  
   
 SELECT AL.Device_ID, COUNT(AL.Device_ID) FROM tbl_TempAndHumidityMonitoringSensor AL   
 INNER JOIN tbl_DeviceDetails D ON AL.Device_ID = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description]in ( 'Kitchen Prod Area' , 'Store Ambient') and AL.Temp_in_degree is not null
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE
 --AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.Device_ID  
  
 --SELECT @Notifications=count(device) FROM #temp WHERE countt < 5  
 --SELECT @Deviations=count(device) FROM #temp WHERE countt BETWEEN 5 AND 10  
 --SELECT @Alerts=count(device) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications=ISNULL(sum(countt), 0) FROM #temp WHERE countt < 5  
 SELECT @Deviations=ISNULL(sum(countt), 0) FROM #temp WHERE countt BETWEEN 5 AND 10  
 SELECT @Alerts=ISNULL(sum(countt), 0) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications AS Notifications,@Deviations AS Deviations,@Alerts AS Alerts  
END  
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientThermalMonitoringOpsInfo]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetAmbientThermalMonitoringOpsInfo]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @OPS_DATA TABLE  
 (  
  OpsType NVARCHAR(100),   
  AssetID INT,   
  AssetName NVARCHAR(250),   
  Temperature DECIMAL(18, 3)  
 )  
  
 DECLARE @Ops_Start_Time TIME  
 DECLARE @Ops_End_Time TIME  
   
 SELECT @Ops_Start_Time = sow.StartTime  
 , @Ops_End_Time = sow.EndTime   
 FROM tbl_SiteOperationWindow sow   
 WHERE SiteOperationWindow = 'Ops Schedule'  
  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MAX'  
 , A.AssetId  
 , a.[Name]  
 , MAX(TS.Temp_in_degree)  
 FROM tbl_TempAndHumidityMonitoringSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND TS.reportdate BETWEEN @START_DATE AND @END_DATE   
 AND CAST(ts.reportdate as time) >= @Ops_Start_Time   
 AND CAST(ts.reportdate as time) < @Ops_End_Time  
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MIN'  
 , A.AssetId  
 , a.[Name]  
 , MIN(TS.Temp_in_degree)  
 FROM tbl_TempAndHumidityMonitoringSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND TS.reportdate BETWEEN @START_DATE AND @END_DATE
 AND (CAST(ts.reportdate as time) < @Ops_Start_Time   
 OR CAST(ts.reportdate as time) >= @Ops_End_Time) 
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 SELECT OpsType  
 , AssetID  
 , AssetName   
 , Temperature  
 FROM @OPS_DATA  
  
END  











GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientThermalMonitoringSeries]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_GetAmbientThermalMonitoringSeries]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END 
  
  
 IF(@days = 0)  
 BEGIN  
  SELECT [Name] as DeviceName  
  , Temp_in_degree as Temperature  
  , RIGHT('0'+LTRIM(RIGHT(CONVERT(varchar,reportdate,100),8)),7) AS LogTime  
  FROM tbl_TempAndHumidityMonitoringSensor ts  
  INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
  INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
  INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
  WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
  AND TS.reportdate between @START_DATE and @END_DATE
  --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
  ORDER BY reportdate  
 END  
  
 IF(@days > 0 AND @days <= 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , CAST(reportdate AS DATE) AS LogTime  
   FROM tbl_TempAndHumidityMonitoringSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
   AND TS.reportdate BETWEEN @START_DATE 
   AND @END_DATE 
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
   
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
 IF(@days > 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , 'Week' + CONVERT(VARCHAR, LogTime) AS LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , DATEPART(WEEK, reportdate) AS LogTime  
   FROM tbl_TempAndHumidityMonitoringSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
   AND TS.reportdate BETWEEN @START_DATE AND @END_DATE 
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientThermalMonitoringTable]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE PROCEDURE [dbo].[sp_GetAmbientThermalMonitoringTable]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
    
 DECLARE @START_DATE DATETIME;  
 DECLARE @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --DECLARE @SiteData TABLE (
	--SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser_V2(@username) 
 -- end here
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END 
  
  SELECT AST.AlertId, A.Name AS DeviceName,  AST.Temperature 
 FROM tbl_Asset A  
 INNER JOIN (  
  SELECT A.AssetId, MAX(al.SensorID) as AlertId ,MAX(AL.Temp_in_degree) as Temperature 
  FROM tbl_Asset A  
  INNER JOIN tbl_AssetType AST ON A.AssetTypeId = AST.AssetTypeId  
  INNER JOIN tbl_DeviceDetails DD ON DD.AssetId = A.AssetId   
  INNER JOIN tbl_TempAndHumidityMonitoringSensor AL ON AL.Device_ID = DD.DeviceIdForExternal   
  WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
  AND AL.ReportDate BETWEEN @START_DATE AND @END_DATE 
  --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
  GROUP BY a.AssetId 
 ) AST ON A.AssetId = AST.AssetId   
  
END  
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACDashboardAlerts]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================  
-- Author:  Prasun Guchhait  
-- Create date: 31-03-2024  
-- Description: Stored Procedurer to get the alerts information for HVAC Devices  
-- =============================================  
alter PROCEDURE [dbo].[sp_GetHVACDashboardAlerts]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @Notifications INT = 0  
 DECLARE @Deviations INT = 0  
 DECLARE @Alerts INT = 0  
 DROP TABLE IF EXISTS #temp  
 CREATE TABLE #temp (device VARCHAR(30),countt INT)  
 INSERT INTO #temp  
   
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'HVAC' 
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE
 --AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.DeviceId  
  
 --SELECT @Notifications=count(device) FROM #temp WHERE countt < 5  
 --SELECT @Deviations=count(device) FROM #temp WHERE countt BETWEEN 5 AND 10  
 --SELECT @Alerts=count(device) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications=ISNULL(sum(countt), 0) FROM #temp WHERE countt < 5  
 SELECT @Deviations=ISNULL(sum(countt), 0) FROM #temp WHERE countt BETWEEN 5 AND 10  
 SELECT @Alerts=ISNULL(sum(countt), 0) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications AS Notifications,@Deviations AS Deviations,@Alerts AS Alerts  
END  




GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACDashboardCompliance]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
-- =============================================  
-- Author:  Prasun Guchhait  
-- Create date: 31-03-2024  
-- Description: Stored Procedurer to get the compiance information for HVAC Devices  
-- =============================================  
alter PROCEDURE [dbo].[sp_GetHVACDashboardCompliance]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @DATEDIFF INT; 
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
  
  
 DROP TABLE IF EXISTS #DEVICE_COUNT  
 DROP TABLE IF EXISTS #COMPLIANCE_DATA  
  
 CREATE TABLE #DEVICE_COUNT (DeviceId VARCHAR(30), DeviceCount INT)  
 CREATE TABLE #COMPLIANCE_DATA (Device varchar(100), NonComplience VARCHAR(100))  
  
 INSERT INTO #DEVICE_COUNT  
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 --WHERE AST.[Description] = 'HVAC' AND CAST(AL.[ReportDate] AS DATE) >= CAST(GETDATE()-@days AS DATE)  
 WHERE AST.[Description] = 'HVAC' 
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE 
-- AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.DeviceId  
  
 INSERT INTO #COMPLIANCE_DATA  
 SELECT ASS.Name AS DisplayName,    
 CAST(((((CAST((SUM(D.DeviceCount)*2) AS DECIMAL))/60)*100)/(24 * (@DATEDIFF+1))) AS DECIMAL(10, 2)) AS CO  
 FROM #DEVICE_COUNT D  
 LEFT JOIN dbo.[tbl_DeviceDetails] DD ON D.DeviceId=DD.DeviceIdForExternal   
 LEFT JOIN [dbo].[tbl_Asset] ASS ON DD.[AssetId]=ASS.AssetId   
 --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY ASS.Name, D.DeviceId  
  
 SELECT Device, NonComplience,CAST((100-CAST(NonComplience AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance   
 FROM #COMPLIANCE_DATA  
 
  
 DROP TABLE #DEVICE_COUNT  
 DROP TABLE  #COMPLIANCE_DATA  
END  








GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACThermalMonitoringOpsInfo]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetHVACThermalMonitoringOpsInfo]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @OPS_DATA TABLE  
 (  
  OpsType NVARCHAR(100),   
  AssetID INT,   
  AssetName NVARCHAR(250),   
  Temperature DECIMAL(18, 3)  
 )  
  
 DECLARE @Ops_Start_Time TIME  
 DECLARE @Ops_End_Time TIME  
   
 SELECT @Ops_Start_Time = sow.StartTime  
 , @Ops_End_Time = sow.EndTime   
 FROM tbl_SiteOperationWindow sow   
 WHERE SiteOperationWindow = 'Ops Schedule'  
  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MAX'  
 , A.AssetId  
 , a.[Name]  
 , MAX(TS.Temp_in_degree)  
 FROM tbl_transactionTempSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'HVAC'   
 AND TS.Tdate BETWEEN @START_DATE AND @END_DATE   
 AND CAST(ts.tdate as time) >= @Ops_Start_Time   
 AND CAST(ts.tdate as time) < @Ops_End_Time  
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MIN'  
 , A.AssetId  
 , a.[Name]  
 , MIN(TS.Temp_in_degree)  
 FROM tbl_transactionTempSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'HVAC'   
 AND TS.Tdate BETWEEN @START_DATE AND @END_DATE
 AND (CAST(ts.tdate as time) < @Ops_Start_Time   
 OR CAST(ts.tdate as time) >= @Ops_End_Time) 
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 SELECT OpsType  
 , AssetID  
 , AssetName   
 , Temperature  
 FROM @OPS_DATA  
  
END  











GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACThermalMonitoringSeries]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetHVACThermalMonitoringSeries]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE); 
  SELECT [Name] as DeviceName  
  , Temp_in_degree as Temperature  
  , RIGHT('0'+LTRIM(RIGHT(CONVERT(varchar,Tdate,100),8)),7) AS LogTime  
  FROM tbl_transactionTempSensor ts  
  INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
  INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
  INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
  WHERE AST.[Description] = 'HVAC'   
  AND TS.Tdate between @START_DATE and @END_DATE
 -- AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  ORDER BY Tdate 
 END  


 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , CAST(Tdate AS DATE) AS LogTime  
   FROM tbl_transactionTempSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] = 'HVAC' 
   AND TS.Tdate BETWEEN @START_DATE 
   AND @END_DATE 
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
   
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END   


 ELSE IF(@days = 90)  
 BEGIN   
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3)); 
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , 'Week' + CONVERT(VARCHAR, LogTime) AS LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , DATEPART(WEEK, Tdate) AS LogTime  
   FROM tbl_transactionTempSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] = 'HVAC' 
   AND TS.Tdate BETWEEN @START_DATE AND @END_DATE
  -- AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime 
 END 
 
 
 END
   
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACThermalMonitoringTable]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================  
-- Author:  Prasun Guchhait  
-- Create date: 31-03-2024  
-- Description: Stored Procedurer to get the alerts information for HVAC Devices  
-- =============================================  
alter PROCEDURE [dbo].[sp_GetHVACThermalMonitoringTable]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END 
  
 SELECT AST.AlertId, A.Name AS DeviceName,  ALT.Temp_in_degree AS Temperature  
 FROM tbl_Asset A  
 INNER JOIN (  
  SELECT A.AssetId, MAX(al.AlertId) as AlertId  
  FROM tbl_Asset A  
  INNER JOIN tbl_AssetType AST ON A.AssetTypeId = AST.AssetTypeId  
  INNER JOIN tbl_DeviceDetails DD ON DD.AssetId = A.AssetId   
  INNER JOIN tbl_Alerts AL ON AL.DeviceId = DD.DeviceIdForExternal   
  WHERE AST.[Description] = 'HVAC' 
  AND AL.ReportDate BETWEEN @START_DATE AND @END_DATE 
  --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
  GROUP BY a.AssetId  
 ) AST ON A.AssetId = AST.AssetId  
 INNER JOIN tbl_Alerts ALT ON ALT.AlertId = AST.AlertId  
  
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetDashboardAlerts]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetKitchenAssetDashboardAlerts]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END    
  
  
 DECLARE @Notifications INT = 0  
 DECLARE @Deviations INT = 0  
 DECLARE @Alerts INT = 0  
 DROP TABLE IF EXISTS #temp  
 CREATE TABLE #temp (device VARCHAR(30),countt INT)  
 INSERT INTO #temp  
   
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'Kitchen Assets' AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE 
 --AND D.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY AL.DeviceId  
  
 SELECT @Notifications=ISNULL(sum(countt), 0) FROM #temp WHERE countt < 5  
 SELECT @Deviations=ISNULL(sum(countt), 0) FROM #temp WHERE countt BETWEEN 5 AND 10  
 SELECT @Alerts=ISNULL(sum(countt), 0) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications AS Notifications,@Deviations AS Deviations,@Alerts AS Alerts  
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetDashboardCompliance]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetKitchenAssetDashboardCompliance]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
  
declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END    
  
  
  
 DROP TABLE IF EXISTS #DEVICE_COUNT  
 DROP TABLE IF EXISTS #COMPLIANCE_DATA  
  
 CREATE TABLE #DEVICE_COUNT (DeviceId VARCHAR(30), DeviceCount INT)  
 CREATE TABLE #COMPLIANCE_DATA (Device varchar(100), NonComplience VARCHAR(100))  
  
 INSERT INTO #DEVICE_COUNT  
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'Kitchen Assets' 
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE   
 --AND D.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY AL.DeviceId  
  
 INSERT INTO #COMPLIANCE_DATA  
 SELECT ASS.Name AS DisplayName,    
 CAST(((((CAST((SUM(D.DeviceCount)*2) AS DECIMAL))/60)*100)/(24 * (@days+1))) AS DECIMAL(10, 2)) AS CO  
 FROM #DEVICE_COUNT D  
 LEFT JOIN dbo.[tbl_DeviceDetails] DD ON D.DeviceId=DD.DeviceIdForExternal   
 LEFT JOIN [dbo].[tbl_Asset] ASS ON DD.[AssetId]=ASS.AssetId 
 --WHERE DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY ASS.Name, D.DeviceId  
  
 SELECT Device, NonComplience,CAST((100-CAST(NonComplience AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance   
 FROM #COMPLIANCE_DATA  
  
 DROP TABLE #DEVICE_COUNT  
 DROP TABLE  #COMPLIANCE_DATA  
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetThermalMonitoringOpsInfo]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter   PROCEDURE [dbo].[sp_GetKitchenAssetThermalMonitoringOpsInfo]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END    
  
 DECLARE @OPS_DATA TABLE  
 (  
  OpsType NVARCHAR(100),   
  AssetID INT,   
  AssetName NVARCHAR(250),   
  Temperature DECIMAL(18, 3)  
 )  
  
 DECLARE @Ops_Start_Time TIME  
 DECLARE @Ops_End_Time TIME  
   
 SELECT @Ops_Start_Time = sow.StartTime  
 , @Ops_End_Time = sow.EndTime   
 FROM tbl_SiteOperationWindow sow   
 WHERE SiteOperationWindow = 'Ops Schedule'  
  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MAX'  
 , A.AssetId  
 , a.[Name]  
 , MAX(TS.Temp_in_degree)  
 FROM tbl_transactionTempSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'Kitchen Assets'   
 AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
 AND CAST(ts.tdate as time) >= @Ops_Start_Time   
 AND CAST(ts.tdate as time) < @Ops_End_Time
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MIN'  
 , A.AssetId  
 , a.[Name]  
 , MIN(TS.Temp_in_degree)  
 FROM tbl_transactionTempSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'Kitchen Assets'  
 AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
 AND (CAST(ts.tdate as time) < @Ops_Start_Time   
 OR CAST(ts.tdate as time) >= @Ops_End_Time)  
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 SELECT OpsType  
 , AssetID  
 , AssetName   
 , Temperature  
 FROM @OPS_DATA  
  
END  
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetThermalMonitoringRefrigerationOpsInfo]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetKitchenAssetThermalMonitoringRefrigerationOpsInfo]  
@days int 
--@username NVARCHAR(100)
AS  
BEGIN  
  
  declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @OPS_DATA TABLE  
 (  
  OpsType NVARCHAR(100),   
  AssetID INT,   
  AssetName NVARCHAR(250),   
  Temperature DECIMAL(18, 3)  
 )  
  
 DECLARE @Ops_Start_Time TIME  
 DECLARE @Ops_End_Time TIME  
   
 SELECT @Ops_Start_Time = sow.StartTime  
 , @Ops_End_Time = sow.EndTime   
 FROM tbl_SiteOperationWindow sow   
 WHERE SiteOperationWindow = 'Ops Schedule'  
  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MAX'  
 , A.AssetId  
 , a.[Name]  
 , MAX(TS.Temp_in_degree)  
 FROM tbl_transactionTempSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] = 'Kitchen Assets'  
 AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
 AND CAST(ts.tdate as time) >= @Ops_Start_Time   
 AND CAST(ts.tdate as time) < @Ops_End_Time  
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 SELECT OpsType  
 , AssetID  
 , AssetName   
 , Temperature  
 FROM @OPS_DATA  
  
END  

GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetThermalMonitoringSeries]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetKitchenAssetThermalMonitoringSeries]  
@days int 
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END    
  
  
 IF(@days = 0)  
 BEGIN  
  SELECT [Name] as DeviceName  
  , Temp_in_degree as Temperature  
  , RIGHT('0'+LTRIM(RIGHT(CONVERT(varchar,Tdate,100),8)),7) AS LogTime  
  FROM tbl_transactionTempSensor ts  
  INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
  INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
  INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
  WHERE AST.[Description] = 'Kitchen Assets'   
  AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
  --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  ORDER BY Tdate  
 END  
  
 IF(@days > 0 AND @days <= 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , CAST(Tdate AS DATE) AS LogTime  
   FROM tbl_transactionTempSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] = 'Kitchen Assets' AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
 IF(@days > 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , 'Week' + CONVERT(VARCHAR, LogTime) AS LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , Temp_in_degree as Temperature  
   , DATEPART(WEEK, Tdate) AS LogTime  
   FROM tbl_transactionTempSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] = 'Kitchen Assets' AND TS.Tdate BETWEEN @START_DATE AND @END_DATE  
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
END

 
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKitchenAssetThermalMonitoringTable]    Script Date: 2/4/2026 9:28:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[sp_GetKitchenAssetThermalMonitoringTable]  
@days int 
--@username NVARCHAR(100)
AS  
BEGIN  
   
declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END    
  
 SELECT AST.AlertId, A.Name AS DeviceName,  ALT.Temp_in_degree AS Temperature  
 FROM tbl_Asset A  
 INNER JOIN (  
  SELECT A.AssetId, MAX(al.AlertId) as AlertId  
  FROM tbl_Asset A  
  INNER JOIN tbl_AssetType AST ON A.AssetTypeId = AST.AssetTypeId  
  INNER JOIN tbl_DeviceDetails DD ON DD.AssetId = A.AssetId   
  INNER JOIN tbl_Alerts AL ON AL.DeviceId = DD.DeviceIdForExternal   
  WHERE AST.[Description] = 'Kitchen Assets' 
  AND AL.ReportDate BETWEEN @START_DATE AND @END_DATE
  --AND DD.SiteId in (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
  GROUP BY a.AssetId  
 ) AST ON A.AssetId = AST.AssetId  
 INNER JOIN tbl_Alerts ALT ON ALT.AlertId = AST.AlertId  
  
END  
GO


USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientHumidityDashboardAlerts]    Script Date: 2/7/2026 4:21:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
create   PROCEDURE [dbo].[sp_GetAmbientHumidityDashboardAlerts]  
@days int 
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (
	--SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser_V2(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @Notifications INT = 0  
 DECLARE @Deviations INT = 0  
 DECLARE @Alerts INT = 0  
 DROP TABLE IF EXISTS #temp  
 CREATE TABLE #temp (device VARCHAR(30),countt INT)  
 INSERT INTO #temp  
   
 SELECT AL.Device_ID, COUNT(AL.Device_ID) FROM tbl_TempAndHumidityMonitoringSensor AL   
 INNER JOIN tbl_DeviceDetails D ON AL.Device_ID = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')  and AL.humidity is not null
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE
 --AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.Device_ID  
  
 --SELECT @Notifications=count(device) FROM #temp WHERE countt < 5  
 --SELECT @Deviations=count(device) FROM #temp WHERE countt BETWEEN 5 AND 10  
 --SELECT @Alerts=count(device) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications=ISNULL(sum(countt), 0) FROM #temp WHERE countt < 5  
 SELECT @Deviations=ISNULL(sum(countt), 0) FROM #temp WHERE countt BETWEEN 5 AND 10  
 SELECT @Alerts=ISNULL(sum(countt), 0) FROM #temp WHERE countt > 10  
  
 SELECT @Notifications AS Notifications,@Deviations AS Deviations,@Alerts AS Alerts  
END  
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientHumidityDashboardCompliance]    Script Date: 2/7/2026 4:21:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
-- =============================================  
-- Author:  Prasun Guchhait  
-- Create date: 31-03-2024  
-- Description: Stored Procedurer to get the compiance information for HVAC Devices  
-- =============================================  
create PROCEDURE [dbo].[sp_GetAmbientHumidityDashboardCompliance]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  
    
 declare @START_DATE DATETIME;  
 declare @DATEDIFF INT; 
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
  SET @DATEDIFF = DATEDIFF(DAY, @START_DATE, @END_DATE);
 END  
  
  
 DROP TABLE IF EXISTS #DEVICE_COUNT  
 DROP TABLE IF EXISTS #COMPLIANCE_DATA  
  
 CREATE TABLE #DEVICE_COUNT (DeviceId VARCHAR(30), DeviceCount INT)  
 CREATE TABLE #COMPLIANCE_DATA (Device varchar(100), NonComplience VARCHAR(100))  
  
 INSERT INTO #DEVICE_COUNT  
 SELECT AL.DeviceId, COUNT(AL.DeviceId) FROM tbl_Alerts AL   
 INNER JOIN tbl_DeviceDetails D ON AL.DeviceId = D.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 --WHERE AST.[Description] = 'HVAC' AND CAST(AL.[ReportDate] AS DATE) >= CAST(GETDATE()-@days AS DATE)  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND AL.[ReportDate] BETWEEN @START_DATE AND @END_DATE 
-- AND D.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY AL.DeviceId  
  
 INSERT INTO #COMPLIANCE_DATA  
 SELECT ASS.Name AS DisplayName,    
 CAST(((((CAST((SUM(D.DeviceCount)*2) AS DECIMAL))/60)*100)/(24 * (@DATEDIFF+1))) AS DECIMAL(10, 2)) AS CO  
 FROM #DEVICE_COUNT D  
 LEFT JOIN dbo.[tbl_DeviceDetails] DD ON D.DeviceId=DD.DeviceIdForExternal   
 LEFT JOIN [dbo].[tbl_Asset] ASS ON DD.[AssetId]=ASS.AssetId   
 --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
 GROUP BY ASS.Name, D.DeviceId  
  
 SELECT Device, NonComplience,CAST((100-CAST(NonComplience AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance   
 FROM #COMPLIANCE_DATA  
 
  
 DROP TABLE #DEVICE_COUNT  
 DROP TABLE  #COMPLIANCE_DATA  
END  








GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientHumidityMonitoringOpsInfo]    Script Date: 2/7/2026 4:21:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetAmbientHumidityMonitoringOpsInfo]  
@days int 
--@username NVARCHAR(100)  
AS  
BEGIN  

 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --declare @SiteData TABLE (SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser(@username)
 -- end here 
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END  
  
 DECLARE @OPS_DATA TABLE  
 (  
  OpsType NVARCHAR(100),   
  AssetID INT,   
  AssetName NVARCHAR(250),   
  Temperature DECIMAL(18, 3)  
 )  
  
 DECLARE @Ops_Start_Time TIME  
 DECLARE @Ops_End_Time TIME  
   
 SELECT @Ops_Start_Time = sow.StartTime  
 , @Ops_End_Time = sow.EndTime   
 FROM tbl_SiteOperationWindow sow   
 WHERE SiteOperationWindow = 'Ops Schedule'  
  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MAX'  
 , A.AssetId  
 , a.[Name]  
 , MAX(TS.humidity)  
 FROM tbl_TempAndHumidityMonitoringSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND TS.reportdate BETWEEN @START_DATE AND @END_DATE   
 AND CAST(ts.reportdate as time) >= @Ops_Start_Time   
 AND CAST(ts.reportdate as time) < @Ops_End_Time  
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 INSERT INTO @OPS_DATA  
 SELECT 'OPS_SCHEDULE_MIN'  
 , A.AssetId  
 , a.[Name]  
 , MIN(TS.humidity)  
 FROM tbl_TempAndHumidityMonitoringSensor ts  
 INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
 INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
 INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
 WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
 AND TS.reportdate BETWEEN @START_DATE AND @END_DATE
 AND (CAST(ts.reportdate as time) < @Ops_Start_Time   
 OR CAST(ts.reportdate as time) >= @Ops_End_Time) 
 --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser(@username))
 GROUP BY A.AssetId, a.Name  
  
 SELECT OpsType  
 , AssetID  
 , AssetName   
 , Temperature  
 FROM @OPS_DATA  
  
END  











GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientHumidityMonitoringSeries]    Script Date: 2/7/2026 4:21:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



create PROCEDURE [dbo].[sp_GetAmbientHumidityMonitoringSeries]  
@days int 
--@username NVARCHAR(100)
AS  
BEGIN  
  
 declare @START_DATE DATETIME;  
 declare @END_DATE DATETIME = GETDATE();  
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END 
  
  
 IF(@days = 0)  
 BEGIN  
  SELECT [Name] as DeviceName  
  , humidity as Temperature  
  , RIGHT('0'+LTRIM(RIGHT(CONVERT(varchar,reportdate,100),8)),7) AS LogTime  
  FROM tbl_TempAndHumidityMonitoringSensor ts  
  INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
  INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
  INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
  WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
  AND TS.reportdate between @START_DATE and @END_DATE
  --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
  ORDER BY reportdate  
 END  
  
 IF(@days > 0 AND @days <= 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , humidity as Temperature  
   , CAST(reportdate AS DATE) AS LogTime  
   FROM tbl_TempAndHumidityMonitoringSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
   AND TS.reportdate BETWEEN @START_DATE AND @END_DATE 
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
   
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
 IF(@days > 30)  
 BEGIN  
  SELECT DeviceName  
  , AVG(Temperature) AS Temperature  
  , 'Week' + CONVERT(VARCHAR, LogTime) AS LogTime  
  FROM  
  (  
   SELECT [Name] as DeviceName  
   , humidity as Temperature  
   , DATEPART(WEEK, reportdate) AS LogTime  
   FROM tbl_TempAndHumidityMonitoringSensor ts  
   INNER JOIN tbl_DeviceDetails DD ON TS.Device_ID = DD.DeviceIdForExternal  
   INNER JOIN tbl_Asset A ON A.AssetId = DD.AssetId  
   INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId  
   WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
   AND TS.reportdate BETWEEN @START_DATE AND @END_DATE   
   --AND DD.SiteId IN (SELECT SiteId FROM dbo.udf_GetSiteAssocitedWithUser_V2(@username))
  ) CTE  
  GROUP BY LogTime, DeviceName  
  ORDER BY LogTime  
 END  
  
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAmbientHumidityMonitoringTable]    Script Date: 2/7/2026 4:21:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
create PROCEDURE [dbo].[sp_GetAmbientHumidityMonitoringTable]  
@days int
--@username NVARCHAR(100)
AS  
BEGIN  
 DECLARE @START_DATE DATETIME;  
 DECLARE @END_DATE DATETIME = GETDATE();  

 -- Site Specefic Code
 --DECLARE @SiteData TABLE (
	--SITE_ID INT)

 --INSERT INTO @SiteData
 --SELECT SiteId FROM udf_GetSiteAssocitedWithUser_V2(@username) 
 -- end here
  
 IF(@days = 0)  
 BEGIN  
  SET @START_DATE = CAST(@END_DATE AS DATE);  
 END  
 ELSE IF(@days = 30)  
 BEGIN  
  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -1));
 END   
 ELSE IF(@days = 90)  
 BEGIN  
  SET @END_DATE = DATEADD(MINUTE, -1,
                     CAST(DATEADD(DAY, 1, EOMONTH(@END_DATE, -1)) AS DATETIME));

  SET @START_DATE = DATEADD(DAY, 1, EOMONTH(@END_DATE, -3));  
 END 
  
  SELECT AST.AlertId, A.Name AS DeviceName,  AST.Humidity AS Temperature
 FROM tbl_Asset A  
 INNER JOIN (  
  SELECT A.AssetId, MAX(al.SensorID) as AlertId ,MAX(AL.humidity) as Humidity 
  FROM tbl_Asset A  
  INNER JOIN tbl_AssetType AST ON A.AssetTypeId = AST.AssetTypeId  
  INNER JOIN tbl_DeviceDetails DD ON DD.AssetId = A.AssetId   
  INNER JOIN tbl_TempAndHumidityMonitoringSensor AL ON AL.Device_ID = DD.DeviceIdForExternal   
  WHERE AST.[Description] in ( 'Kitchen Prod Area' , 'Store Ambient')
  AND AL.ReportDate BETWEEN @START_DATE AND @END_DATE 
  --AND DD.SiteId IN (SELECT SITE_ID FROM @SiteData)
  GROUP BY a.AssetId 
 ) AST ON A.AssetId = AST.AssetId   
  
END  
GO
