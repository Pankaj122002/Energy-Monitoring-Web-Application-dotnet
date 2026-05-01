USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainmeter_HourlyAvgVoltage_hot]    Script Date: 1/9/2026 6:08:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetAllmeter_HourlyAvgPowerfactor_hot] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
   SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,
    E.ReadingHour,
    ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,
        DATEPART(HOUR, CreateDate) AS ReadingHour,
        p3
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



    Union ALL

    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,
    E.ReadingHour,
    ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,
        DATEPART(HOUR, CreateDate) AS ReadingHour,
        p9
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName
WHERE D.DeviceName  NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')
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













USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllmeter_WeeklyAvgPowerfactor_cold]    Script Date: 1/9/2026 6:26:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_GetAllmeter_WeeklyAvgPowerfactor_cold] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
     SELECT 
    D.DeviceName,
    E.DeviceID,
    E.YearNo,
    E.WeekNo,
    ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CreateDate,
        DATEPART(YEAR, CreateDate) AS YearNo,
        DATEPART(WEEK, CreateDate) AS WeekNo,
        p3
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



UNION ALL

SELECT 
    D.DeviceName,
    E.DeviceID,
    E.YearNo,
    E.WeekNo,
    ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CreateDate,
        DATEPART(YEAR, CreateDate) AS YearNo,
        DATEPART(WEEK, CreateDate) AS WeekNo,
        p9
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName 
WHERE D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')
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







USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllmeter_DailyAvgPowerfactor_warm]    Script Date: 1/9/2026 6:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_GetAllmeter_DailyAvgPowerfactor_warm] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,  -- this is the date (no time)
    ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p3) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,  -- strip time, keep only date
        CreateDate,
        p3  
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

    UNION ALL 

    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.ReadingDate,  -- this is the date (no time)
    ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) AS AvgPowerfactor,
    CASE 
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.98 THEN 'green'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) >= 0.95 AND ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)),2) < 0.98 THEN 'yellow'
       WHEN ROUND(AVG(TRY_CAST(ABS(E.p9) AS FLOAT)), 2) < 0.95 THEN 'red'
    END AS ColourFlag
FROM (
    SELECT 
        p2 AS DeviceID,
        CAST(CreateDate AS date) AS ReadingDate,  -- strip time, keep only date
        CreateDate,
        p9  
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate
                         AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D 
    ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M 
    ON M.Asset = D.DeviceName 
WHERE D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')
GROUP BY 
    D.DeviceName, 
    E.DeviceID,
    E.ReadingDate
ORDER BY 
    E.DeviceID,
    E.ReadingDate;


END





USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllMeters_ActualPowerfactor]    Script Date: 1/9/2026 6:28:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_GetAllMeters_ActualPowerfactor] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    /* Negative PF → Positive */
    ABS(E.[p3]) AS Powerfactor,
    CASE 
       WHEN ABS(E.[p3]) >= 0.98 THEN 'green'
       WHEN ABS(E.[p3]) >= 0.95 AND ABS(E.[p3]) < 0.98 THEN 'yellow'
       WHEN ABS(E.[p3]) < 0.95 THEN 'red'
    END AS ColourFlag,    
    E.[CreateDate]
    FROM [dbo].[tbl_EnergyMeter] E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName and D.DeviceName = 'Main Meter'
WHERE E.CreateDate BETWEEN @fromdate
                         AND @todate


UNION ALL

SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    /* Negative PF → Positive */
    ABS(E.[p9]) AS Powerfactor,
    CASE 
       WHEN ABS(E.[p9]) >= 0.98 THEN 'green'
       WHEN ABS(E.[p9]) >= 0.95 AND ABS(E.[p9]) < 0.98 THEN 'yellow'
       WHEN ABS(E.[p9]) < 0.95 THEN 'red'
    END AS ColourFlag,    
    E.[CreateDate]
    FROM [dbo].[tbl_EnergyMeter] E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName and D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')
WHERE E.CreateDate BETWEEN @fromdate
                         AND @todate

Order by p2, CreateDate ;
END








USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllMeters_LastUpdated_Powerfactor]    Script Date: 1/9/2026 6:37:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_GetAllMeters_LastUpdated_Powerfactor] 
AS
BEGIN
  
/* ==== SUB METERS (using p2) ==== */
SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,

    /* Negative PF → Positive */
    ABS(E.[p9]) AS Powerfactor,
    CASE 
       WHEN ABS(E.[p9]) >= 0.98 THEN 'green'
       WHEN ABS(E.[p9]) >= 0.95 AND ABS(E.[p9]) < 0.98 THEN 'yellow'
       WHEN ABS(E.[p9]) < 0.95 THEN 'red'
    END AS ColourFlag,    

    E.[CreateDate]
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY p2 ORDER BY CreateDate DESC) AS rn
    FROM [dbo].[tbl_EnergyMeter]
) E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName
WHERE E.rn = 1
  AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')

UNION ALL

/* ==== MAIN METER (using p3) ==== */
SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,

    /* Negative PF → Positive */
    ABS(E.[p3]) AS Powerfactor,
    CASE 
       WHEN ABS(E.[p3]) >= 0.98 THEN 'green'
       WHEN ABS(E.[p3]) >= 0.95 AND ABS(E.[p3]) < 0.98 THEN 'yellow'
       WHEN ABS(E.[p3]) < 0.95 THEN 'red'
    END AS ColourFlag,    
    E.[CreateDate]
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY p2 ORDER BY CreateDate DESC) AS rn
    FROM [dbo].[tbl_EnergyMeter]
) E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName
WHERE E.rn = 1 AND 
  D.DeviceName = 'Main Meter'

ORDER BY Powerfactor DESC;



END





USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllmeter_WeeklyAvgPowerfactor_cold]    Script Date: 1/10/2026 6:44:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_GetAllmeter_AvgPowerfactor] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
  
SELECT
    D.DeviceName,
    E.p2 AS DeviceID,

    COUNT(
        CASE 
            WHEN TRY_CAST(ABS(E.p3) AS FLOAT) >= 0.98 
            THEN 1 
        END
    ) AS [Count],

    ROUND(
        AVG(
            CASE 
                WHEN TRY_CAST(ABS(E.p3) AS FLOAT) >= 0.98 
                THEN TRY_CAST(ABS(E.p3) AS FLOAT)
            END
        ), 2
    ) AS Powerfactor,

    'green' AS ColourFlag

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName = 'Main Meter'

WHERE 
    E.CreateDate >= @fromdate
    AND E.CreateDate <=  @todate

GROUP BY
    D.DeviceName,
    E.p2




UNION ALL



SELECT
    D.DeviceName,
    E.p2 AS DeviceID,

    COUNT(
        CASE 
            WHEN TRY_CAST(ABS(E.p3) AS FLOAT) < 0.95 
            THEN 1 
        END
    ) AS [Count],

    ROUND(
        AVG(
            CASE 
                WHEN TRY_CAST(ABS(E.p3) AS FLOAT) < 0.95 
                THEN TRY_CAST(ABS(E.p3) AS FLOAT)
            END
        ), 2
    ) AS Powerfactor,

    'red' AS ColourFlag

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName = 'Main Meter'

WHERE 
    E.CreateDate >= @fromdate
    AND E.CreateDate <= @todate

GROUP BY
    D.DeviceName,
    E.p2


union all

   
SELECT
    D.DeviceName,
    E.p2 AS DeviceID,

    COUNT(
        CASE 
            WHEN TRY_CAST(ABS(E.p9) AS FLOAT) >= 0.98 
            THEN 1 
        END
    ) AS [Count],

    ROUND(
        AVG(
            CASE 
                WHEN TRY_CAST(ABS(E.p9) AS FLOAT) >= 0.98 
                THEN TRY_CAST(ABS(E.p9) AS FLOAT)
            END
        ), 2
    ) AS Powerfactor,

    'green' AS ColourFlag

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')

WHERE 
    E.CreateDate >= @fromdate
    AND E.CreateDate <=  @todate

GROUP BY
    D.DeviceName,
    E.p2


UNION ALL



SELECT
    D.DeviceName,
    E.p2 AS DeviceID,

    COUNT(
        CASE 
            WHEN TRY_CAST(ABS(E.p9) AS FLOAT) < 0.95 
            THEN 1 
        END
    ) AS [Count],

    ROUND(
        AVG(
            CASE 
                WHEN TRY_CAST(ABS(E.p9) AS FLOAT) < 0.95 
                THEN TRY_CAST(ABS(E.p9) AS FLOAT)
            END
        ), 2
    ) AS Powerfactor,

    'red' AS ColourFlag

FROM dbo.tbl_EnergyMeter E
INNER JOIN dbo.tbl_Device D 
    ON E.p2 = D.DeviceNo
INNER JOIN dbo.tbl_MeterAssetMapping M 
    ON M.Asset = D.DeviceName
   AND D.DeviceName NOT IN ('Main Meter', 'DiningCassetteHVAC3',
                           'DiningCassetteHVAC2')

WHERE 
    E.CreateDate >= @fromdate
    AND E.CreateDate <=  @todate

GROUP BY
    D.DeviceName,
    E.p2

order by DeviceID

END