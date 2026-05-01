USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMainMeter_Runhr]    Script Date: 11/5/2025 4:35:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetMainMeter_Runhr] 
AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    E.[p14] AS Runhr,
    E.[CreateDate]
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY p2 ORDER BY CreateDate DESC) AS rn
    FROM [dbo].[tbl_EnergyMeter]
) E
INNER JOIN [dbo].[tbl_Device] D ON E.p2 = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName and D.DeviceName = 'Main Meter'
WHERE E.rn = 1;
END

========================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSubMeter_Runhr]    Script Date: 11/5/2025 4:35:33 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetSubMeter_Runhr] 
AS
BEGIN
    SELECT DISTINCT
    E.[EnergyMeterId],
    D.DeviceName,
    E.[p2] AS DeviceID,
    E.[p7] AS Runhr,
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
  Order by E.[p7] DESC ;

END

========================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDevice_AvgRunhr]    Script Date: 11/8/2025 8:23:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetDevice_AvgRunhr] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
     SELECT 
    D.DeviceName,
    E.DeviceID,
    Avg(E.ACRUN_HRS) AS AvgRunhr
FROM (
    SELECT DISTINCT 
        p2 AS DeviceID,
        CreateDate,
        ACRUN_HRS
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate AND @todate
) E
INNER JOIN [dbo].[tbl_Device] D ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName
GROUP BY D.DeviceName, E.DeviceID
Order by E.DeviceID;
END

==========================================================================================================================================================================

USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDevice_SumRunhr]    Script Date: 11/8/2025 8:23:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_GetDevice_SumRunhr] 
@fromdate DATETIME, @todate DATETIME
AS
BEGIN
    SELECT 
    D.DeviceName,
    E.DeviceID,
    E.SumRunhr
FROM (
    SELECT DISTINCT 
        p2 AS DeviceID,
        SUM(ACRUN_HRS) AS SumRunhr
    FROM [dbo].[tbl_EnergyMeter]
    WHERE CreateDate BETWEEN @fromdate AND @todate
	GROUP BY p2
) E
INNER JOIN [dbo].[tbl_Device] D ON E.DeviceID = D.DeviceNo
INNER JOIN [dbo].[tbl_MeterAssetMapping] M ON M.Asset = D.DeviceName
GROUP BY D.DeviceName, E.DeviceID, E.SumRunhr
Order by E.DeviceID;
END

