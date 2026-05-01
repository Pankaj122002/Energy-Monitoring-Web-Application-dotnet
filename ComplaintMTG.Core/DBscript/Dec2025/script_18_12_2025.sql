ALTER TABLE [dbo].[tbl_Asset]
ADD Flag VARCHAR(255);

UPDATE [dbo].[tbl_Asset]
SET Flag = 'P'
WHERE Name IN ('Veg and Non-Veg Chiller - 2 Door - Chiller 5',
 'Veg Upright Chiller-1 4 door', 
 'Under Counter Chiller Non-Veg',
 'Under Counter Chiller 2 Veg',
'Deep Freezer Veg',
'Deep Freezer Spicy Veg',
'Vertical Freezer 1 Veg and Non Veg',
'Deep Freezer Non Veg',
'Makeline',
'Holding Cabinet',
'Production Area - Ambient',
'Prod Area Right Side DUCT Ac2');


UPDATE [dbo].[tbl_Asset]
SET Flag = 'D'
WHERE Name IN ('Store Dining Ambient',
'Cassette Unit near Counter',
'Cassette Unit near Entrance',
'Cassette Unit Center',
'Dining Left Side Duct AC1');


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStore_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStore_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where Flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStore_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStore_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStore_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStore_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompiance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO             


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS noncompliance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreNonOps_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreOps_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreOps_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS noncomplaince 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreOps_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /24) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_DiningWiseComplicanceofStoreOps_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_DiningWiseComplicanceofStoreOps_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'D'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Cold]    Script Date: 12/19/2025 2:13:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Cold]
	@StartDate DATETIME,
	@EndDate DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @TotalWindows INT;
SELECT @TotalWindows = COUNT(*)
FROM dbo.tbl_SiteOperationWindow;

DECLARE @NumDays INT;
SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1;

;WITH AlertWindowCount AS
(
    SELECT 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime,
        COUNT(a.DeviceId) AS DeviceIdCount,

        /* Calculate window hours (ignore minutes & seconds) */
        CASE 
            WHEN DATEPART(HOUR, sow.EndTime) >= DATEPART(HOUR, sow.StartTime)
                THEN (DATEPART(HOUR, sow.EndTime) - DATEPART(HOUR, sow.StartTime) +1)
            ELSE
                ((12 - DATEPART(HOUR, sow.StartTime)) + DATEPART(HOUR, sow.EndTime)+1)
        END AS WindowHours

    FROM dbo.tbl_Alerts a
    JOIN dbo.tbl_SiteOperationWindow sow
        ON CAST(a.CreateDate AS TIME) 
           BETWEEN sow.StartTime AND sow.EndTime
    WHERE a.ReportDate BETWEEN @StartDate AND @EndDate
    GROUP BY 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime
)
SELECT
    SiteOperationWindow,
    StartTime,
    EndTime,
    WindowHours,
    DeviceIdCount,

    /* Non-Compliance % */
    CAST(
        (((DeviceIdCount * 2.0) / 60) * 100) 
        / (@NumDays * WindowHours * @TotalWindows)
        AS DECIMAL(10,2)
    ) AS NonCompliancePercent,

    /* Compliance % */
    CAST(
        100 -
        (
            (((DeviceIdCount * 2.0) / 60) * 100)
            / (@NumDays * WindowHours * @TotalWindows)
        )
        AS DECIMAL(10,2)
    ) AS CompliancePercent

FROM AlertWindowCount;

END


 
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Warm]    Script Date: 12/19/2025 2:13:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Warm]
	@StartDate DATETIME,
	@EndDate DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @TotalWindows INT;
SELECT @TotalWindows = COUNT(*)
FROM dbo.tbl_SiteOperationWindow;

DECLARE @NumDays INT;
SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1;

;WITH AlertWindowCount AS
(
    SELECT 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime,
        COUNT(a.DeviceId) AS DeviceIdCount,

        /* Calculate window hours (ignore minutes & seconds) */
        CASE 
            WHEN DATEPART(HOUR, sow.EndTime) >= DATEPART(HOUR, sow.StartTime)
                THEN (DATEPART(HOUR, sow.EndTime) - DATEPART(HOUR, sow.StartTime) +1)
            ELSE
                ((12 - DATEPART(HOUR, sow.StartTime)) + DATEPART(HOUR, sow.EndTime)+1)
        END AS WindowHours

    FROM dbo.tbl_Alerts a
    JOIN dbo.tbl_SiteOperationWindow sow
        ON CAST(a.CreateDate AS TIME) 
           BETWEEN sow.StartTime AND sow.EndTime
    WHERE a.ReportDate BETWEEN @StartDate AND @EndDate
    GROUP BY 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime
)
SELECT
    SiteOperationWindow,
    StartTime,
    EndTime,
    WindowHours,
    DeviceIdCount,

    /* Non-Compliance % */
    CAST(
        (((DeviceIdCount * 2.0) / 60) * 100) 
        / (@NumDays * WindowHours * @TotalWindows)
        AS DECIMAL(10,2)
    ) AS NonCompliancePercent,

    /* Compliance % */
    CAST(
        100 -
        (
            (((DeviceIdCount * 2.0) / 60) * 100)
            / (@NumDays * WindowHours * @TotalWindows)
        )
        AS DECIMAL(10,2)
    ) AS CompliancePercent

FROM AlertWindowCount;

END



 
/USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Hot]    Script Date: 12/19/2025 2:13:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Hot]
	@StartDate DATETIME,
	@EndDate DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @TotalWindows INT;
SELECT @TotalWindows = COUNT(*)
FROM dbo.tbl_SiteOperationWindow;

DECLARE @NumDays INT;
SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1;

;WITH AlertWindowCount AS
(
    SELECT 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime,
        COUNT(a.DeviceId) AS DeviceIdCount,

        /* Calculate window hours (ignore minutes & seconds) */
        CASE 
            WHEN DATEPART(HOUR, sow.EndTime) >= DATEPART(HOUR, sow.StartTime)
                THEN (DATEPART(HOUR, sow.EndTime) - DATEPART(HOUR, sow.StartTime) +1)
            ELSE
                ((12 - DATEPART(HOUR, sow.StartTime)) + DATEPART(HOUR, sow.EndTime)+1)
        END AS WindowHours

    FROM dbo.tbl_Alerts a
    JOIN dbo.tbl_SiteOperationWindow sow
        ON CAST(a.CreateDate AS TIME) 
           BETWEEN sow.StartTime AND sow.EndTime
    WHERE a.ReportDate BETWEEN @StartDate AND @EndDate
    GROUP BY 
        sow.SiteOperationWindow,
        sow.StartTime,
        sow.EndTime
)
SELECT
    SiteOperationWindow,
    StartTime,
    EndTime,
    WindowHours,
    DeviceIdCount,

    /* Non-Compliance % */
    CAST(
        (((DeviceIdCount * 2.0) / 60) * 100) 
        / (@NumDays * WindowHours * @TotalWindows)
        AS DECIMAL(10,2)
    ) AS NonCompliancePercent,

    /* Compliance % */
    CAST(
        100 -
        (
            (((DeviceIdCount * 2.0) / 60) * 100)
            / (@NumDays * WindowHours * @TotalWindows)
        )
        AS DECIMAL(10,2)
    ) AS CompliancePercent

FROM AlertWindowCount;

END


 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStore_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStore_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStore_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStore_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStore_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStore_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO

 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompiance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS noncompliance 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '00:01:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreOps_Cold]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreOps_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS noncomplaince 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO


 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreOps_Hot]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /24) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO



 
/****** Object:  StoredProcedure [dbo].[sp_ProductionWiseComplicanceofStoreOps_Warm]    Script Date: 12/18/2025 12:24:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[sp_ProductionWiseComplicanceofStoreOps_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), SecValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '22:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS noncompliance
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId where flag = 'P'
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        SecValue,
        (100 - SecValue) AS FirValue 
    FROM #tempp
END
GO




USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEnergyDistributionDashboard]    Script Date: 12/20/2025 3:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER   procedure [dbo].[sp_GetEnergyDistributionDashboard]
as
begin
drop table  IF EXISTS #tempEnergy
create table #tempEnergy
(
	DeviceNo [varchar](50),
	DeviceName [varchar](50) ,
	cumm_en decimal(18,2)
)
insert into #tempEnergy
Select 
D.DeviceNo,
D.DeviceName,
SUM(E.KWH) as cumm_en  
FROM [dbo].[tbl_EnergyMeter] E 
JOIN [dbo].[tbl_Device] D ON E.p2=D.[DeviceNo] 
left join dbo.[tbl_DeviceDetails] DD ON D.DeviceNo=DD.DeviceIdForExternal 
left join [dbo].[tbl_Asset] ASS ON DD.[AssetId]=ASS.AssetId and D.DeviceNo!='SlaveID1'
where cast(E.CreateDate as date)=cast(Getdate() as date)
group by D.DeviceNo,DeviceName

declare @totalEnergyConsume as decimal(18,2)
set @totalEnergyConsume=(Select Sum(cumm_en) from #tempEnergy)
Select DeviceName,(Sum(cumm_en)/@totalEnergyConsume)*100 as energyConsume 
from #tempEnergy where DeviceName NOT IN ('Main Meter')
group by DeviceName
END

--Select (Individual Meter KWH/Main Meter KWH)*100











 USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetTopValueMeter]    Script Date: 12/20/2025 3:38:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_GetTopValueMeter]
as
begin
SELECT 
CASE
    WHEN D.DeviceNo = 'SlaveID1' THEN E.[ToatalPWR]
    ELSE E.[ToatalPWR]
END AS P,D.DeviceName FROM 
[dbo].[tbl_EnergyMeter] E 
INNER JOIN tbl_Device D ON E.P2=D.DeviceNo and D.DeviceName NOT IN ('Main Meter')
WHERE E.EnergyMeterId IN (
SELECT max(E.[EnergyMeterId]) 
FROM [dbo].[tbl_EnergyMeter] E INNER JOIN tbl_Device D ON E.P2=D.DeviceNo group by E.[p2])
end
