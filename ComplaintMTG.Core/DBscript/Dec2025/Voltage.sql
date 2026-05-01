USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_Voltage]    Script Date: 12/1/2025 1:34:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainMeter_Voltage] 

AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    E.[p16] AS Voltage,
	E.[p5] AS R_Voltage,
	E.[p8] AS Y_Voltage,
	E.[p11] AS B_Voltage,
    E.[CreateDate]
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY p2 ORDER BY CreateDate DESC) AS rn
    FROM [dbo].[tbl_EnergyMeter]
) E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName and D.DeviceName = 'Main Meter'
WHERE E.rn = 1
Order by CreateDate desc;
END


--------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSubMeter_Voltage]    Script Date: 12/1/2025 1:01:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetSubMeter_Voltage] 
AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
     E.[p10] AS Voltage,
	E.[p11] AS R_Voltage,
	E.[p12] AS Y_Voltage,
	E.[p13] AS B_Voltage,
    E.[CreateDate]
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY p2 ORDER BY CreateDate DESC) AS rn
    FROM [dbo].[tbl_EnergyMeter]
) E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName
WHERE E.rn = 1
  AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3', 'DiningCassetteHVAC2')
  Order by E.[p10] DESC ;

END


---------------------------------------------------------------------------------------------------------------------------------------------------
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_HighVoltage]    Script Date: 12/1/2025 1:02:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainMeter_HighVoltage] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
SELECT 
    
    D.DeviceName,
    E.p2 AS DeviceID,

    ROUND(AVG(CASE WHEN TRY_CAST(E.p16 AS FLOAT) > 240 
                   THEN TRY_CAST(E.p16 AS FLOAT) END), 2) AS AvgHighVoltage,

    /* Count how many rows where any phase >240 */
    COUNT(CASE 
            WHEN TRY_CAST(E.p16 AS FLOAT) > 240 
            THEN 1 
          END) AS HighVoltageCount

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName = 'Main Meter'

WHERE 
    /* Time range filter */
    E.CreateDate BETWEEN @fromdate AND @todate

    /* Voltage > 240 filter */
    AND (
            TRY_CAST(E.p16 AS FLOAT) > 240
         
        )

GROUP BY 
    
    D.DeviceName,
    E.p2;

END


---------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_LowVoltage]    Script Date: 12/1/2025 1:03:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainMeter_LowVoltage] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
SELECT 
    
    D.DeviceName,
    E.p2 AS DeviceID,

    ROUND(AVG(CASE WHEN TRY_CAST(E.p16 AS FLOAT) < 220 
                   THEN TRY_CAST(E.p16 AS FLOAT) END), 2) AS AvgLowVoltage,

  
    COUNT(CASE 
            WHEN TRY_CAST(E.p16 AS FLOAT) < 220 
            THEN 1 
          END) AS LowVoltageCount

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName = 'Main Meter'

WHERE 
    /* Time range filter */
    E.CreateDate BETWEEN @fromdate AND @todate

   
    AND (
            TRY_CAST(E.p16 AS FLOAT) < 220 
         
        )

GROUP BY 
    
    D.DeviceName,
    E.p2;

END

---------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSubMeter_HighVoltage]    Script Date: 12/1/2025 1:03:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetSubMeter_HighVoltage] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
SELECT 
    
    D.DeviceName,
    E.p2 AS DeviceID,

    ROUND(AVG(CASE WHEN TRY_CAST(E.p10 AS FLOAT) > 240
                   THEN TRY_CAST(E.p10 AS FLOAT) END), 2) AS AvgHighVoltage,

  
    COUNT(CASE 
            WHEN TRY_CAST(E.p10 AS FLOAT) > 240
            THEN 1 
          END) AS HighVoltageCount

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3', 'DiningCassetteHVAC2')

WHERE 
    /* Time range filter */
    E.CreateDate BETWEEN @fromdate AND @todate

   
    AND (
            TRY_CAST(E.p10 AS FLOAT) > 240
         
        )

GROUP BY 
    
    D.DeviceName,
    E.p2;

END

---------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSubMeter_LowVoltage]    Script Date: 12/1/2025 1:04:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetSubMeter_LowVoltage] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
SELECT 
    
    D.DeviceName,
    E.p2 AS DeviceID,

    ROUND(AVG(CASE WHEN TRY_CAST(E.p10 AS FLOAT) < 220 
                   THEN TRY_CAST(E.p10 AS FLOAT) END), 2) AS AvgLowVoltage,

  
    COUNT(CASE 
            WHEN TRY_CAST(E.p10 AS FLOAT) < 220 
            THEN 1 
          END) AS LowVoltageCount

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3', 'DiningCassetteHVAC2')

WHERE 
    /* Time range filter */
    E.CreateDate BETWEEN @fromdate AND @todate

   
    AND (
            TRY_CAST(E.p10 AS FLOAT) < 220 
         
        )

GROUP BY 
    
    D.DeviceName,
    E.p2;

END

----------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainmeter_DailyAvgVoltage_warm]    Script Date: 12/1/2025 1:04:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainmeter_DailyAvgVoltage_warm] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,  -- this is the date (no time)
    ROUND(AVG(TRY_CAST(E.p16 AS FLOAT)), 2) AS Total_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p5  AS FLOAT)), 2) AS R_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p8  AS FLOAT)), 2) AS Y_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p11 AS FLOAT)), 2) AS B_AvgVoltage
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,  -- strip time, keep only date
        CreateDate,
        p16,
        p5,
        p8,
        p11
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName 
WHERE D.DeviceName = 'Main Meter'
GROUP BY 
    D.DeviceName, 
    E.DeviceID,
    E.ReadingDate
ORDER BY 
    E.DeviceID,
    E.ReadingDate;


END

-----------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainmeter_HourlyAvgVoltage_hot]    Script Date: 12/1/2025 1:05:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainmeter_HourlyAvgVoltage_hot] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
   SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,
    E.ReadingHour,
    ROUND(AVG(TRY_CAST(E.p16 AS FLOAT)), 2) AS Total_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p5  AS FLOAT)), 2) AS R_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p8  AS FLOAT)), 2) AS Y_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p11 AS FLOAT)), 2) AS B_AvgVoltage
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,
        DATEPART(HOUR, CreateDate) AS ReadingHour,
        p16,
        p5,
        p8,
        p11
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName
WHERE D.DeviceName = 'Main Meter'
GROUP BY 
    D.DeviceName, 
    E.DeviceID,
    E.ReadingDate,
    E.ReadingHour
ORDER BY 
    E.DeviceID,
    E.ReadingDate,
    E.ReadingHour;


END

------------------------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainmeter_WeeklyAvgVoltage_cold]    Script Date: 12/1/2025 1:05:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainmeter_WeeklyAvgVoltage_cold] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.YearNo,
    E.WeekNo,
    ROUND(AVG(TRY_CAST(E.p16 AS FLOAT)), 2) AS Total_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p5  AS FLOAT)), 2) AS R_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p8  AS FLOAT)), 2) AS Y_AvgVoltage,
    ROUND(AVG(TRY_CAST(E.p11 AS FLOAT)), 2) AS B_AvgVoltage
FROM (
    SELECT 
        p2 AS DeviceID,
        CreateDate,
        DATEPART(YEAR, CreateDate) AS YearNo,
        DATEPART(WEEK, CreateDate) AS WeekNo,
        p16,
        p5,
        p8,
        p11
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName 
WHERE D.DeviceName = 'Main Meter'
GROUP BY 
    D.DeviceName, 
    E.DeviceID,
    E.YearNo,
    E.WeekNo
ORDER BY 
    E.DeviceID,
    E.YearNo,
    E.WeekNo;

END


--------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_Voltage]    Script Date: 12/1/2025 1:25:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetMainMeter_ActualVoltage] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    E.[p16] AS Voltage,
	E.[p5] AS R_Voltage,
	E.[p8] AS Y_Voltage,
	E.[p11] AS B_Voltage,
    E.[CreateDate]
    FROM [dbo].[tbl_EnergyMeter] E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName and D.DeviceName = 'Main Meter'
WHERE E.CreateDate BETWEEN @fromdate
                         AND @todate
Order by CreateDate ;
END