--Stored Procedure for Alert Count
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAlertCountByDateTime_Hot]    Script Date: 7/10/2025 10:03:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
Create PROCEDURE [dbo].[sp_GetAlertCountByDateTime_Hot]
	-- Add the parameters for the stored procedure here
	@fromdate datetime,
	@todate datetime
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>

    SELECT COUNT(1) AS AlertCount
    FROM [dbo].[tbl_Alerts]
    WHERE CreateDate BETWEEN @fromdate AND @todate

END

-------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAlertCountByDateTime_Warm]    Script Date: 7/10/2025 10:03:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
Create PROCEDURE [dbo].[sp_GetAlertCountByDateTime_Warm]
	-- Add the parameters for the stored procedure here
	@fromdate datetime,
	@todate datetime
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>

    SELECT COUNT(1) AS AlertCount
    FROM [dbo].[tbl_Alerts]
    WHERE CreateDate BETWEEN @fromdate AND @todate

END

-------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAlertCountByDateTime_Cold]    Script Date: 7/10/2025 10:03:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
Create PROCEDURE [dbo].[sp_GetAlertCountByDateTime_Cold]
	-- Add the parameters for the stored procedure here
	@fromdate datetime,
	@todate datetime
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>

    SELECT COUNT(1) AS AlertCount
    FROM [dbo].[tbl_Alerts]
    WHERE CreateDate BETWEEN @fromdate AND @todate

END

---------------------------------------------------------------------------------------------------------------
--Stored Procedure for Alert Data
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAlertDataByDateTime]    Script Date: 12/24/2024 6:02:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetAlertDataByDateTime]
	-- Add the parameters for the stored procedure here
	@fromdate datetime,
	@todate datetime,
	@page int,
	@size int
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>
declare @startrow int ,
        @endrow int

set @startrow = ((@page-1)*@size) +1;
set @endrow = @page*@size;

WITH AlertData AS ( 
    SELECT 
        [AlertId],
        [Temp_in_degree],
        [DeviceId],
        [ReportDate],
        [CreateBy],
        [CreateDate],
        [ModifyBy],
        [ModifyDate],
        ROW_NUMBER() OVER (ORDER BY CreateDate DESC) AS Rownumber
    FROM [dbo].[tbl_Alerts]
    WHERE CreateDate BETWEEN @fromdate AND @todate
)
SELECT *
FROM AlertData
WHERE Rownumber BETWEEN @startrow and @endrow;
  
END

--------------------------------------------------------------------------------------------------------------------------------------------------------------------
--Stored Precedure for SiteOperationWindow
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSiteOperationWindow]    Script Date: 2/18/2025 11:29:31 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetSiteOperationWindow]
	@StartTime DATETIME,
	@EndTime DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		sow.SiteOperationWindow, 
		COUNT(a.AlertId) AS AlertCount
	FROM 
		[dbo].[tbl_Alerts] a
	JOIN 
		[dbo].[tbl_SiteOperationWindow] sow 
		ON CAST(a.CreateDate AS TIME) BETWEEN sow.StartTime AND sow.EndTime
	WHERE 
		a.CreateDate BETWEEN @StartTime AND @EndTime
	GROUP BY 
		sow.SiteOperationWindow;
END;

=================================================================================
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Hot]    Script Date: 7/10/2025 10:07:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Hot]
	@StartTime DATETIME,
	@EndTime DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		sow.SiteOperationWindow, 
		COUNT(a.[DeviceId]) AS ComplianceCount
	FROM 
		[dbo].[tbl_Alerts] a
    JOIN 
	[dbo].[tbl_SiteOperationWindow] sow 
	ON CAST(a.CreateDate AS TIME) BETWEEN sow.StartTime AND sow.EndTime
    WHERE
	a.CreateDate BETWEEN @StartTime AND @EndTime
	GROUP BY sow.SiteOperationWindow;
END

=======================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Warm]    Script Date: 7/10/2025 10:07:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Warm]
	@StartTime DATETIME,
	@EndTime DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		sow.SiteOperationWindow, 
		COUNT(a.[DeviceId]) AS ComplianceCount
	FROM 
		[dbo].[tbl_Alerts] a
    JOIN 
	[dbo].[tbl_SiteOperationWindow] sow 
	ON CAST(a.CreateDate AS TIME) BETWEEN sow.StartTime AND sow.EndTime
    WHERE
	a.CreateDate BETWEEN @StartTime AND @EndTime
	GROUP BY sow.SiteOperationWindow;
END

=================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetOperationsWiseCompliance_Cold]    Script Date: 7/10/2025 10:07:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetOperationsWiseCompliance_Cold]
	@StartTime DATETIME,
	@EndTime DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		sow.SiteOperationWindow, 
		COUNT(a.[DeviceId]) AS ComplianceCount
	FROM 
		[dbo].[tbl_Alerts] a
    JOIN 
	[dbo].[tbl_SiteOperationWindow] sow 
	ON CAST(a.CreateDate AS TIME) BETWEEN sow.StartTime AND sow.EndTime
    WHERE
	a.CreateDate BETWEEN @StartTime AND @EndTime
	GROUP BY sow.SiteOperationWindow;
END

===================================================================================================================================
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverall_Hot]    Script Date: 7/10/2025 9:50:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverall_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    -- Temporary table for storing alert counts per device
    DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    -- Populate #temp with alert counts per device
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt
    FROM [dbo].[tbl_Alerts]
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId];

    -- Calculate non-compliance percentage and store in #tempp
    INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverall_Warm]    Script Date: 7/10/2025 9:50:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverall_Warm]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

    -- Temporary table for storing alert counts per device
    DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    -- Populate #temp with alert counts per device
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt
    FROM [dbo].[tbl_Alerts]
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId];

    -- Calculate non-compliance percentage and store in #tempp
    INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

-------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverall_Cold]    Script Date: 7/10/2025 9:52:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverall_Cold]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

    -- Temporary table for storing alert counts per device
    DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    -- Populate #temp with alert counts per device
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt
    FROM [dbo].[tbl_Alerts]
    WHERE [ReportDate] BETWEEN @StartDate AND @EndDate
    GROUP BY [DeviceId];

    -- Calculate non-compliance percentage and store in #tempp
    INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

-------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallNonOps_Hot]    Script Date: 7/10/2025 9:54:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallNonOps_Hot]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

---------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallNonOps_Warm]    Script Date: 7/10/2025 9:54:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallNonOps_Warm]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

---------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallNonOps_Cold]    Script Date: 7/10/2025 9:54:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallNonOps_Cold]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

-------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallOps_Hot]    Script Date: 7/10/2025 9:55:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallOps_Hot]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;


	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / ( 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

--------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallOps_Warm]    Script Date: 7/10/2025 9:55:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallOps_Warm]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;


------------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_ComplianceDashboardAllOverallOps_Cold]    Script Date: 7/10/2025 9:55:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[sp_ComplianceDashboardAllOverallOps_Cold]
    @startdate DATETIME,
    @enddate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @StartDate, @EndDate) + 1; -- +1 to include both start and end dates

	DROP TABLE IF EXISTS #temp;
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT);

    -- Temporary table for storing non-compliance percentage
    DROP TABLE IF EXISTS #tempp;
    CREATE TABLE #tempp (nonCompliance DECIMAL(10,2));

    INSERT INTO #temp
	SELECT 
	    [DeviceId],
        COUNT(DeviceId) AS Countt
    FROM 
        [dbo].[tbl_Alerts] -- Replace with your actual table name
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
		GROUP BY [DeviceId];

		INSERT INTO #tempp
    SELECT 
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * COUNT(A.DeviceId))) AS DECIMAL(10,2)) AS nonCompliance
    FROM #temp A;

    -- Retrieve compliance percentage
    SELECT 
        nonCompliance,
        CAST((100 - CAST(nonCompliance AS DECIMAL(18,2))) AS DECIMAL(18,2)) AS Compliance 
    FROM #tempp;
END;

--------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStore_Hot]    Script Date: 7/10/2025 9:57:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStore_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

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
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

-----------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStore_Warm]    Script Date: 7/10/2025 9:57:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStore_Warm]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

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
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

---------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStore_Cold]    Script Date: 7/10/2025 9:57:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStore_Cold]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

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
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

--------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Hot]    Script Date: 7/10/2025 10:00:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
     
	SET NOCOUNT ON;
    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / 24) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

=================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Warm]    Script Date: 7/10/2025 10:00:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Warm]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

======================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Cold]    Script Date: 7/10/2025 10:00:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Cold]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

-----------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreOps_Hot]    Script Date: 7/10/2025 10:01:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreOps_Hot]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN

    SET NOCOUNT ON;

    
    -- Temporary tables
    DROP TABLE IF EXISTS #temp
    CREATE TABLE #temp (DeviceId VARCHAR(30), countt INT)

    DROP TABLE IF EXISTS #tempp
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /24) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

------------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreOps_Warm]    Script Date: 7/10/2025 10:01:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreOps_Warm]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END

-------------------------------------------------------------------------------------------------------------------------

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeviceWiseComplicanceofStoreOps_Cold]    Script Date: 7/10/2025 10:01:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_DeviceWiseComplicanceofStoreOps_Cold]
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
    CREATE TABLE #tempp (device VARCHAR(100), FirValue DECIMAL(10,2))

    -- Insert alert counts per device within the date range
    INSERT INTO #temp
    SELECT       
        [DeviceId],
        COUNT([DeviceId]) AS countt 
    FROM [dbo].[tbl_Alerts] 
    WHERE 
        ReportDate BETWEEN @startdate AND @enddate
        AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    GROUP BY [DeviceId]

    -- Calculate compliance values
    INSERT INTO #tempp
    SELECT 
        ASS.Name AS DispalyName,
        CAST(((((CAST((SUM(A.countt) * 2) AS DECIMAL)) / 60) * 100) /(@NumDays * 24)) AS DECIMAL(10,2)) AS CO 
    FROM #temp A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    GROUP BY ASS.Name, A.DeviceId

    -- Final result: compliance and non-compliance
    SELECT 
        device,
        FirValue,
        (100 - FirValue) AS SecValue 
    FROM #tempp
END


===================================================================================================================================================================
--Stored procedure of employee and gues comfort overall
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboard_Hot]    Script Date: 8/13/2025 5:23:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboard_Hot]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
=================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboard_Warm]    Script Date: 8/13/2025 5:26:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboard_Warm]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboard_Cold]    Script Date: 8/13/2025 5:27:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboard_Cold]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END

===================================================================================================================================================================
--Date : 12 Aug 2025

--Stroed procedure for employee and guest comfort ( details )
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Hot]    Script Date: 8/13/2025 5:29:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Hot]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
===============================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Warm]    Script Date: 8/13/2025 5:30:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Warm]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
=====================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Cold]    Script Date: 8/13/2025 5:34:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetail_Cold]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
=====================================================================================================================================================================
--Date : 12 Aug 2025
--stored procedure for employee and guest dashboard ( Ops schedule)

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Hot]    Script Date: 8/13/2025 5:35:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Hot]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
==================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Warm]    Script Date: 8/13/2025 5:35:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Warm]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
=====================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Cold]    Script Date: 8/13/2025 5:36:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardOps_Cold]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025

-- stored procedure for employeee and guest dashboard ( NonOps schedule)
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Hot]    Script Date: 8/13/2025 5:37:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Hot]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Warm]    Script Date: 8/13/2025 5:37:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Warm]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Cold]    Script Date: 8/13/2025 5:37:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Cold]
    @fromDate DATETIME,
    @toDate DATETIME
AS
BEGIN
    DECLARE @guestAlertsCount INT
    DECLARE @guestComfort DECIMAL(18,2)
    DECLARE @guestDeviceCount INT = 3

    DECLARE @employeeAlertsCount INT
    DECLARE @employeeComfort DECIMAL(18,2)
    DECLARE @employeeDeviceCount INT = 1

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    -- Get Guest Device Count
    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    -- Get Employee Device Count
    SET @employeeDeviceCount = (
        CASE 
            WHEN (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) = 0 
            THEN 1 
            ELSE (SELECT COUNT(*) FROM [tbl_Asset] WHERE AssetTypeId = 11) 
        END
    )

    -- Guest Alerts Count
    SET @guestAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
    )

    -- Guest Comfort Calculation
    SET @guestComfort = (
        SELECT CAST(((((CAST((@guestAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @guestDeviceCount)) AS DECIMAL)
    )

    -- Employee Alerts Count
    SET @employeeAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
    )

    -- Employee Comfort Calculation
    SET @employeeComfort = (
        SELECT CAST(((((CAST((@employeeAlertsCount * 2) AS DECIMAL)) / 60) * 100) / (@NumDays * 24 * @employeeDeviceCount)) AS DECIMAL)
    )

    -- Final Result
    SELECT 
        (100 - @guestComfort) AS guestComfort,
        (100 - @employeeComfort) AS employeeComfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025

--stored procedure for employee and guest comfort ( details ) ( Ops schedule) 
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Hot]    Script Date: 8/13/2025 5:38:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Hot]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
==================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Warm]    Script Date: 8/13/2025 5:39:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Warm]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Cold]    Script Date: 8/13/2025 5:39:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailOps_Cold]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '11:00:00.000' AND '23:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
===================================================================================================================================================================
--Date : 12 Aug 2025
--stored procedure for employee and guest comfort (details) ( Nonops schedule)

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Hot]    Script Date: 8/13/2025 5:40:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Hot]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / 24 AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
======================================================================================================================================================================
--Date : 12 Aug 2025

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Warm]    Script Date: 8/13/2025 5:41:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Warm]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
====================================================================================================================================================================
--Date : 12 Aug 2025
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Cold]    Script Date: 8/13/2025 5:41:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetEmployeeGuestConfortDashboardDetailNonOps_Cold]
    @fromDate DATETIME,
    @toDate   DATETIME
AS
BEGIN
    DECLARE @guestUnderCoolingAlertsCount INT
    DECLARE @guestOverCoolingAlertsCount INT
    DECLARE @guestComplianceAlertsCount INT
    DECLARE @guestDeviceCount INT

    DECLARE @employeeUnderCoolingAlertsCount INT
    DECLARE @employeeOverCoolingAlertsCount INT
    DECLARE @employeeComplianceAlertsCount INT
    DECLARE @employeeDeviceCount INT

	DECLARE @NumDays INT;
    SET @NumDays = DATEDIFF(DAY, @fromDate, @toDate) + 1; -- +1 to include both start and end dates

    SET @guestDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId IN (3, 13)
    )

    SET @employeeDeviceCount = (
        SELECT COUNT(*) 
        FROM [tbl_Asset] 
        WHERE AssetTypeId = 11
    )

    -- Guest counts
    SET @guestUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree > AR.UCL
    )

    SET @guestOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree < AR.LCL
    )

    SET @guestComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId IN (3, 13)
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Employee counts
    SET @employeeUnderCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree > AR.UCL
    )

    SET @employeeOverCoolingAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree < AR.LCL
    )

    SET @employeeComplianceAlertsCount = (
        SELECT COUNT(1)
        FROM [dbo].[tbl_Alerts] A
        LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
        LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
        LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
        WHERE A.ReportDate BETWEEN @fromDate AND @toDate
		AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
        AND ASS.AssetTypeId = 11
        AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    )

    -- Temporary tables
    DROP TABLE IF EXISTS #tempOverCooling
    CREATE TABLE #tempOverCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempUnderCooling
    CREATE TABLE #tempUnderCooling (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempCompliance
    CREATE TABLE #tempCompliance (deviceName VARCHAR(100), alertCount DECIMAL(10,2))

    DROP TABLE IF EXISTS #tempEmpGuestConfort
    CREATE TABLE #tempEmpGuestConfort (
        deviceName VARCHAR(100),
        OverCooling DECIMAL(10,2),
        UnderCooling DECIMAL(10,2),
        Compliance DECIMAL(10,2)
    )

    -- Fill temp tables
    INSERT INTO #tempOverCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree < AR.LCL
    GROUP BY ASS.Name

    INSERT INTO #tempUnderCooling
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree > AR.UCL
    GROUP BY ASS.Name

    INSERT INTO #tempCompliance
    SELECT ASS.Name, COUNT(ASS.Name)
    FROM [dbo].[tbl_Alerts] A
    LEFT JOIN dbo.[tbl_DeviceDetails] D ON A.DeviceId = D.DeviceIdForExternal 
    LEFT JOIN [dbo].[tbl_Asset] ASS ON D.AssetId = ASS.AssetId 
    LEFT JOIN tbl_AssetRules AR ON ASS.AssetId = AR.AssetId
    WHERE A.ReportDate BETWEEN @fromDate AND @toDate
	AND CAST(ReportDate AS TIME) BETWEEN '01:00:00.000' AND '10:59:00.000'
    AND ASS.AssetTypeId IN (3, 13, 11)
    AND A.Temp_in_degree BETWEEN AR.LCL AND AR.UCL
    GROUP BY ASS.Name

    -- Summary Insert for Guest
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Guest Overall',
        CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@guestOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@guestUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @guestDeviceCount) AS DECIMAL), 0)

    -- Summary Insert for Employee
    INSERT INTO #tempEmpGuestConfort
    SELECT 'Employee Overall',
        CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL),
        100 - ISNULL(CAST(((@employeeOverCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)
            - ISNULL(CAST(((@employeeUnderCoolingAlertsCount * 2.0) / 60 * 100) / (@NumDays * 24 * @employeeDeviceCount) AS DECIMAL), 0)

    -- Per device stats
    INSERT INTO #tempEmpGuestConfort
    SELECT 
        ASS.Name,
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempOverCooling WHERE deviceName = ASS.Name
        ), 0),
        ISNULL((
            SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
            FROM #tempUnderCooling WHERE deviceName = ASS.Name
        ), 0),
        100 
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempOverCooling WHERE deviceName = ASS.Name
            ), 0)
            - ISNULL((
                SELECT CAST(((alertCount * 2.0) / 60 * 100) / (@NumDays *24) AS DECIMAL) 
                FROM #tempUnderCooling WHERE deviceName = ASS.Name
            ), 0)
    FROM [dbo].[tbl_Asset] ASS
    WHERE ASS.AssetTypeId IN (3, 13, 11)

    -- Final output
    SELECT * FROM #tempEmpGuestConfort
END
================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetDeepFreezerNonVeg_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1007'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

===================================================================================================================================================================
USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetVegDeepFreezer&IceCubeMaker_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1008'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END


=================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetChillerUnderCounter_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1010'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END


====================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_Getallmainmeterdetails_hot]    Script Date: 9/11/2025 9:15:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_Getallmainmeterdetails_hot] 
    @fromdate DATETIME,
    @todate DATETIME
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p3] AS Powerfactor_avg,
        E.[p4] AS Watts_Rphase
      ,E.[p5] AS VA_Rphase
      ,E.[p6] AS Current_Rphase
      ,E.[p7] AS Watts_Yphase
      ,E.[p8] AS VA_Yphase
      ,E.[p9] AS Current_Yphase
      ,E.[p10] AS Watts_Bphase
      ,E.[p11] AS VA_Bphase 
      ,E.[p12] AS Current_Bphase
      ,E.[p13] AS Wh_received
      ,E.[p14] AS Run_hr
      ,E.[p15] As Watts_Total
      ,E.[p16] AS Powerfactor_R
      ,E.[p17] AS Powerfactor_Y
      ,E.[p18] AS Powerfactor_B
      ,E.[p19] As VA_Total
      ,E.[p20] As Current_avg
	  ,E.p21   As Vah_received
		,E.p22 AS KW_demand
		,E.p23 As KVA_demand
		,E.p24 AS KW_maxdemand
		,E.p25 AS KVA_maxdemand
		,E.[p26] AS On_hours
		,E.p27 AS KWh_Rphase
		,E.p28 AS KWh_Yphase
		,E.p29 AS KWh_Bphase
		,E.p30 AS KVAh_Rphase
		,E.p31 AS KVAh_Yphase
		,E.p32 AS KVAh_Bphase
		,E.p33 AS Runhr_Rphase
		,E.p34 AS Runhr_Yphase
		,E.p35 AS Runhr_Bphase
		,E.p36 AS Voltage_VR_unbalance
		,E.p37 AS Voltage_VY_unbalance
		,E.p38 AS Voltage_VB_unbalance
		,E.p39 AS Current_AR_unbalance
		,E.p40 AS Current_AY_unbalance
		,E.p41 AS Current_AB_unbalance
		,E.p42 AS CO2
    FROM [dbo].[tbl_EnergyMeter] E
	INNER JOIN [dbo].[tbl_MeterMaster] M ON E.p2 = M.MeterMasterID AND M.MainMeter='Y'
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
	WHERE
    CAST(E.CreateDate AS DATE) BETWEEN @fromdate AND @todate
    ORDER BY EnergyMeterId DESC;
END

=====================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_Getallmainmeterdetails_warm]    Script Date: 9/11/2025 9:17:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_Getallmainmeterdetails_warm] 
    @fromdate DATETIME,
    @todate DATETIME
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p3] AS Powerfactor_avg,
        E.[p4] AS Watts_Rphase
      ,E.[p5] AS VA_Rphase
      ,E.[p6] AS Current_Rphase
      ,E.[p7] AS Watts_Yphase
      ,E.[p8] AS VA_Yphase
      ,E.[p9] AS Current_Yphase
      ,E.[p10] AS Watts_Bphase
      ,E.[p11] AS VA_Bphase 
      ,E.[p12] AS Current_Bphase
      ,E.[p13] AS Wh_received
      ,E.[p14] AS Run_hr
      ,E.[p15] As Watts_Total
      ,E.[p16] AS Powerfactor_R
      ,E.[p17] AS Powerfactor_Y
      ,E.[p18] AS Powerfactor_B
      ,E.[p19] As VA_Total
      ,E.[p20] As Current_avg
	  ,E.p21   As Vah_received
		,E.p22 AS KW_demand
		,E.p23 As KVA_demand
		,E.p24 AS KW_maxdemand
		,E.p25 AS KVA_maxdemand
		,E.[p26] AS On_hours
		,E.p27 AS KWh_Rphase
		,E.p28 AS KWh_Yphase
		,E.p29 AS KWh_Bphase
		,E.p30 AS KVAh_Rphase
		,E.p31 AS KVAh_Yphase
		,E.p32 AS KVAh_Bphase
		,E.p33 AS Runhr_Rphase
		,E.p34 AS Runhr_Yphase
		,E.p35 AS Runhr_Bphase
		,E.p36 AS Voltage_VR_unbalance
		,E.p37 AS Voltage_VY_unbalance
		,E.p38 AS Voltage_VB_unbalance
		,E.p39 AS Current_AR_unbalance
		,E.p40 AS Current_AY_unbalance
		,E.p41 AS Current_AB_unbalance
		,E.p42 AS CO2
    FROM [dbo].[tbl_EnergyMeter] E
	INNER JOIN [dbo].[tbl_MeterMaster] M ON E.p2 = M.MeterMasterID AND M.MainMeter='Y'
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
	WHERE
    CAST(E.CreateDate AS DATE) BETWEEN @fromdate AND @todate
    ORDER BY EnergyMeterId DESC;
END

=================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_Getallmainmeterdetails_cold]    Script Date: 9/11/2025 9:18:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_Getallmainmeterdetails_cold] 
    @fromdate DATETIME,
    @todate DATETIME
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p3] AS Powerfactor_avg,
        E.[p4] AS Watts_Rphase
      ,E.[p5] AS VA_Rphase
      ,E.[p6] AS Current_Rphase
      ,E.[p7] AS Watts_Yphase
      ,E.[p8] AS VA_Yphase
      ,E.[p9] AS Current_Yphase
      ,E.[p10] AS Watts_Bphase
      ,E.[p11] AS VA_Bphase 
      ,E.[p12] AS Current_Bphase
      ,E.[p13] AS Wh_received
      ,E.[p14] AS Run_hr
      ,E.[p15] As Watts_Total
      ,E.[p16] AS Powerfactor_R
      ,E.[p17] AS Powerfactor_Y
      ,E.[p18] AS Powerfactor_B
      ,E.[p19] As VA_Total
      ,E.[p20] As Current_avg
	  ,E.p21   As Vah_received
		,E.p22 AS KW_demand
		,E.p23 As KVA_demand
		,E.p24 AS KW_maxdemand
		,E.p25 AS KVA_maxdemand
		,E.[p26] AS On_hours
		,E.p27 AS KWh_Rphase
		,E.p28 AS KWh_Yphase
		,E.p29 AS KWh_Bphase
		,E.p30 AS KVAh_Rphase
		,E.p31 AS KVAh_Yphase
		,E.p32 AS KVAh_Bphase
		,E.p33 AS Runhr_Rphase
		,E.p34 AS Runhr_Yphase
		,E.p35 AS Runhr_Bphase
		,E.p36 AS Voltage_VR_unbalance
		,E.p37 AS Voltage_VY_unbalance
		,E.p38 AS Voltage_VB_unbalance
		,E.p39 AS Current_AR_unbalance
		,E.p40 AS Current_AY_unbalance
		,E.p41 AS Current_AB_unbalance
		,E.p42 AS CO2
    FROM [dbo].[tbl_EnergyMeter] E
	INNER JOIN [dbo].[tbl_MeterMaster] M ON E.p2 = M.MeterMasterID AND M.MainMeter='Y'
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
	WHERE
    CAST(E.CreateDate AS DATE) BETWEEN @fromdate AND @todate
    ORDER BY EnergyMeterId DESC;
END

======================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetVeg&Non-VegVerticalChiller_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1011'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

==================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetSignage_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1012'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_Get3PhaseExhaust_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1013'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

=====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Modified ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_Get3PhaseFreshAir_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1014'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_Runhr]    Script Date: 9/23/2025 5:19:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetMainMeter_Runhr] 
AS
BEGIN
    SELECT TOP 1
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr],
		E.CreateDate
    FROM [dbo].[tbl_MeterAssetMapping] M
	INNER JOIN [dbo].[tbl_Device] D ON M.Asset = D.DeviceName AND D.DeviceName = 'Main Meter'
	INNER JOIN [dbo].[tbl_EnergyMeter] E ON E.p2 = d.DeviceNo
    ORDER BY E.CreateDate DESC;
END

=====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACEntrance_Runhr]    Script Date: 9/23/2025 5:23:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetHVACEntrance_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1002'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

==================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACcentre_Runhr]    Script Date: 9/23/2025 5:24:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetHVACcentre_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1005'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

===============================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHVACcounter_Runhr]    Script Date: 9/23/2025 5:24:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetHVACcounter_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1006'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

==================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFryer_Runhr]    Script Date: 9/23/2025 5:25:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetFryer_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1009'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRO&ROMeter_Runhr]    Script Date: 9/23/2025 5:26:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetRO&ROMeter_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
	WHERE E.p2 = '1003'
    ORDER BY EnergyMeterId DESC;
END

====================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetLights_Runhr]    Script Date: 9/23/2025 5:28:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[sp_GetLights_Runhr] 
AS
BEGIN
    SELECT TOP 1 
        E.[EnergyMeterId],
        D.DeviceName,
        E.[p1] AS MacAddress,
        E.[p2] AS DeviceID,
        E.[p7] AS [Run hr]
    FROM [dbo].[tbl_EnergyMeter] E
    LEFT JOIN [dbo].[tbl_Device] D ON E.p2 = D.[DeviceNo]
    WHERE E.p2 = '1004'
    ORDER BY E.EnergyMeterId DESC;  -- always picks latest inserted/updated row
END

======================================================================================================================================


