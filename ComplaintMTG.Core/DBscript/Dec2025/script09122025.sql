USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAlertCount_OpsNonOpsPercentage]    Script Date: 12/10/2025 11:42:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[sp_GetAlertCount_OpsNonOpsPercentage]
	-- Add the parameters for the stored procedure here
	@fromdate datetime,
	@todate datetime
AS
BEGIN

	WITH FilteredAlerts AS (
    SELECT *
    FROM dbo.tbl_Alerts
    WHERE CreateDate BETWEEN @fromdate
                        AND @todate
)
SELECT
    (SELECT COUNT(*) FROM FilteredAlerts) AS TotalCount,

    -- Counts (works if JOIN does not duplicate rows)
    SUM(CASE WHEN sow.SiteOperationWindow = 'Ops Schedule' THEN 1 ELSE 0 END) AS OpsCount,
    SUM(CASE WHEN sow.SiteOperationWindow = 'No Ops Schedule' THEN 1 ELSE 0 END) AS NonOpsCount,

    -- Percentages (based on TotalCount)
    CAST(
      ROUND(
        100.0 * SUM(CASE WHEN sow.SiteOperationWindow = 'Ops Schedule' THEN 1 ELSE 0 END)
        / NULLIF((SELECT COUNT(*) FROM FilteredAlerts), 0),
      2)
    AS DECIMAL(10,2)) AS OpsPercentage,

    CAST(
      ROUND(
        100.0 * SUM(CASE WHEN sow.SiteOperationWindow = 'No Ops Schedule' THEN 1 ELSE 0 END)
        / NULLIF((SELECT COUNT(*) FROM FilteredAlerts), 0),
      2)
    AS DECIMAL(10,2)) AS NonOpsPercentage

FROM FilteredAlerts fa
LEFT JOIN dbo.tbl_SiteOperationWindow sow
  ON CAST(fa.CreateDate AS TIME) BETWEEN sow.StartTime AND sow.EndTime;


END







USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSiteOperationWindow]    Script Date: 12/10/2025 10:48:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetSiteOperationWindow]
	@fromdate DATETIME,
	@todate DATETIME
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
		a.CreateDate BETWEEN @fromdate AND @todate
	GROUP BY 
		sow.SiteOperationWindow;
END;