USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyProfile]    Script Date: 1/28/2026 3:27:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
[sp_EnergyTrends_EnergyProfile] 'Hot'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Warm'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Cold'

Select * from tbl_EnergyMeter where EnergyMeterId>490654

*/

ALTER   procedure [dbo].[sp_EnergyTrends_EnergyProfile]
@TimeCategory varchar(50)
as
begin
if(@TimeCategory='Hot')
BEGIN

with hours as (
      select 1 as hh
      union all
      select hh + 1
      from hours
      where hh < 23
     )
select h.hh,sum(s.KWH) as KWH,sum(s.calc_kvah) as KVAH
from hours h
join [tbl_EnergyMeter] s on datepart(hour, s.CreateDate) = h.hh and  convert(date,s.CreateDate) = convert(date,getdate())
--where s.p1='1001'
group by h.hh
order by h.hh;

END
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
        DECLARE @WarmStartDate DATE = DATEADD(MONTH, -1, CONVERT(DATE, GETDATE()));
        DECLARE @WarmEndDate   DATE = CONVERT(DATE, GETDATE());

        WITH hours AS
        (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1
            FROM hours
            WHERE hh < 23
        )
        SELECT 
            h.hh,
            SUM(s.KWH) AS KWH,
            SUM(s.calc_kvah) AS KVAH
        FROM hours h
        JOIN tbl_EnergyMeter s 
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND CONVERT(DATE, s.CreateDate) BETWEEN @WarmStartDate AND @WarmEndDate
           --where s.p1='1001'

        GROUP BY h.hh
        ORDER BY h.hh;
    END

    ELSE IF (@TimeCategory = 'Cold')
    BEGIN
        DECLARE @ColdStartDate DATE =
            CONVERT(DATE, DATEADD(MONTH, -3, GETDATE()) 
            - (DAY(DATEADD(MONTH, -3, GETDATE())) - 1));

        DECLARE @ColdEndDate DATE = CONVERT(DATE, GETDATE());

        WITH hours AS
        (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1
            FROM hours
            WHERE hh < 23
        )
        SELECT 
            h.hh,
            SUM(s.KWH) AS KWH,
            SUM(s.calc_kvah) AS KVAH
        FROM hours h
        JOIN tbl_EnergyMeter s 
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND CONVERT(DATE, s.CreateDate) BETWEEN @ColdStartDate AND @ColdEndDate
         --  where s.p1='1001'

        GROUP BY h.hh
        ORDER BY h.hh;
    END
END

















USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionPeak]    Script Date: 1/28/2026 3:27:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
[sp_EnergyTrends_EnergyConsumptionPeak] 'Hot'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Warm'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Cold'

Select * from tbl_EnergyMeter where EnergyMeterId>490654

*/

ALTER PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionPeak]
@TimeCategory VARCHAR(50)
AS
BEGIN

    DECLARE @startDate DATE;

    /* ---------------- HOT (TODAY) ---------------- */
    IF (@TimeCategory = 'Hot')
    BEGIN
        WITH hours AS (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1
            FROM hours
            WHERE hh < 23
        )
        SELECT 
            h.hh,
            SUM(s.KWH) AS KWH,
            SUM(s.calc_kvah) AS KVAH
        FROM hours h
        JOIN tbl_EnergyMeter s
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND CONVERT(DATE, s.CreateDate) = CONVERT(DATE, GETDATE())
        GROUP BY h.hh
        ORDER BY h.hh;
    END

    /* ---------------- WARM (CURRENT 1 MONTH) ---------------- */
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
        SET @startDate =
            DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0);

        WITH hours AS (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1
            FROM hours
            WHERE hh < 23
        )
        SELECT 
            h.hh,
            SUM(s.KWH) AS KWH,
            SUM(s.calc_kvah) AS KVAH
        FROM hours h
        JOIN tbl_EnergyMeter s
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND CONVERT(DATE, s.CreateDate) >= @startDate
           AND CONVERT(DATE, s.CreateDate) <= CONVERT(DATE, GETDATE())
        GROUP BY h.hh
        ORDER BY h.hh;
    END

    /* ---------------- COLD (LAST 3 MONTHS) ---------------- */
    ELSE IF (@TimeCategory = 'Cold')
    BEGIN
        SET @startDate =
            CONVERT(DATE,
                DATEADD(MONTH, -3, GETDATE())
                - (DAY(DATEADD(MONTH, -3, GETDATE())) - 1)
            );

        WITH hours AS (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1
            FROM hours
            WHERE hh < 23
        )
        SELECT 
            h.hh,
            SUM(s.KWH) AS KWH,
            SUM(s.calc_kvah) AS KVAH
        FROM hours h
        JOIN tbl_EnergyMeter s
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND CONVERT(DATE, s.CreateDate) >= @startDate
           AND CONVERT(DATE, s.CreateDate) <= CONVERT(DATE, GETDATE())
        GROUP BY h.hh
        ORDER BY h.hh;
    END
END













USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureLive]    Script Date: 1/28/2026 3:26:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureLive]
(
    @TimeCategory VARCHAR(20),
    @MeterName    VARCHAR(200) = NULL   -- 👈 NEW PARAMETER
)
AS
BEGIN
    SET NOCOUNT ON;

    -------------------------------------------------
    -- VARIABLES FOR HOT
    -------------------------------------------------
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    SET @StartDate = CAST(GETDATE() AS DATE);
    SET @EndDate   = GETDATE();

    -------------------------------------------------
    -- HOT DATA
    -------------------------------------------------
    IF (@TimeCategory = 'Hot')
    BEGIN
        ;WITH EnergyData AS
        (
            SELECT
                D.DeviceName AS MeterName,
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                SUM(EM.KWH) AS KWH,
                SUM(EM.calc_kvah) AS KVAH
            FROM tbl_EnergyMeter EM
            INNER JOIN tbl_Device D 
                ON EM.p2 = D.DeviceNo
            WHERE EM.CreateDate >= @StartDate
              AND EM.CreateDate <  @EndDate
              AND (
                    @MeterName IS NULL 
                    OR @MeterName = '' 
                    OR D.DeviceName = @MeterName
                  )
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate),
                D.DeviceName,
                EM.p2
        ),
        TempData AS
        (
            SELECT
                CAST(TS.Tdate AS DATE) AS [Date],
                DATEPART(HOUR, TS.Tdate) AS HourSlot,
                TS.Device_ID,
                MAX(TS.Temp_in_degree) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS
            WHERE TS.Tdate >= @StartDate
              AND TS.Tdate <  @EndDate
            GROUP BY
                CAST(TS.Tdate AS DATE),
                DATEPART(HOUR, TS.Tdate),
                TS.Device_ID
        )
        SELECT
            E.MeterName,
            E.MeterID,
            E.[Date],
            E.HourSlot,
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        INNER JOIN EnergyData E
            ON E.[Date] = T.[Date]
           AND E.HourSlot = T.HourSlot
        ORDER BY 
            E.[Date], 
            E.HourSlot, 
            E.MeterID;
    END



    -------------------------------------------------
    -- WARM (NO CHANGE)
    -------------------------------------------------
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
        SELECT
            CONVERT(DATE, CreateDate) AS [Date],
            SUM(KWH) AS KWH,
            SUM(calc_kvah) AS KVAH
        FROM tbl_EnergyMeter
        WHERE MONTH(CreateDate) = MONTH(GETDATE())
          AND YEAR(CreateDate)  = YEAR(GETDATE())
          AND (calc_kvah <> '0.00' OR KWH <> '0.00')
          AND p2 = 'SlaveID2'
        GROUP BY CONVERT(DATE, CreateDate)
        ORDER BY CONVERT(DATE, CreateDate) ASC;

        SELECT
            AVG(Temp_in_degree) AS Temp_in_degree,
            CONVERT(DATE, Tdate) AS Tdate
        FROM tbl_transactionTempSensor TS
        INNER JOIN tbl_DeviceDetails D ON TS.Device_ID = D.DeviceIdForExternal
        INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId
        INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId
        WHERE AST.[Description] = 'HVAC'
          AND TS.Device_ID = 'PE-T-04'
          AND MONTH(Tdate) = MONTH(GETDATE())
          AND YEAR(Tdate)  = YEAR(GETDATE())
        GROUP BY CONVERT(DATE, Tdate)
        ORDER BY CONVERT(DATE, Tdate) ASC;
    END

    -------------------------------------------------
    -- COLD (VARIABLE NAMES FIXED)
    -------------------------------------------------
    ELSE IF (@TimeCategory = 'Cold')
    BEGIN
        DECLARE @ColdStartDate DATE =
            CONVERT(DATE, DATEADD(MONTH, -3, GETDATE())
            - (DAY(DATEADD(MONTH, -3, GETDATE())) - 1));

        DECLARE @ColdEndDate DATE =
            CONVERT(DATE, DATEADD(DAY, -(DAY(GETDATE())), GETDATE()));

        SELECT
            MAX(DATENAME(MM, CreateDate)) AS [Date],
            SUM(KWH) AS KWH,
            SUM(calc_kvah) AS KVAH
        FROM tbl_EnergyMeter
        WHERE CONVERT(DATE, CreateDate)
              BETWEEN @ColdStartDate AND @ColdEndDate
          AND (calc_kvah <> '0.00' OR KWH <> '0.00')
          AND p2 = 'SlaveID2'
        GROUP BY MONTH(CreateDate)
        ORDER BY MONTH(CreateDate) ASC;

        SELECT
            AVG(Temp_in_degree) AS Temp_in_degree,
            MAX(DATENAME(MM, Tdate)) AS Tdate
        FROM tbl_transactionTempSensor TS
        INNER JOIN tbl_DeviceDetails D ON TS.Device_ID = D.DeviceIdForExternal
        INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId
        INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId
        WHERE AST.[Description] = 'HVAC'
          AND TS.Device_ID = 'PE-T-04'
          AND CONVERT(DATE, Tdate)
              BETWEEN @ColdStartDate AND @ColdEndDate
        GROUP BY MONTH(Tdate)
        ORDER BY MONTH(Tdate) ASC;
    END
END



























USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature]    Script Date: 1/28/2026 3:27:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
[sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature] 'Hot'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Warm'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Cold'

Select * from tbl_EnergyMeter where EnergyMeterId>490654

*/

ALTER procedure [dbo].[sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature]
@TimeCategory varchar(50)
as
begin
if(@TimeCategory='Hot')
BEGIN

with hours as (
      select 1 as hh
      union all
      select hh + 1
      from hours
      where hh < 23
     )
select h.hh, Try_Cast(sum(s.KWH) as decimal(18,2)) as KWH,Try_Cast(sum(s.calc_kvah) as decimal(18,2)) as KVAH,
(Select AVG(Temp_in_degree) from tbl_transactionTempSensor TS
INNER JOIN tbl_DeviceDetails D ON TS.Device_ID = D.DeviceIdForExternal
INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId
INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId
WHERE AST.[Description] = 'HVAC' and TS.Device_ID='PE-T-04' --right now qery for one device
and CONVERT(date,TS.Tdate)=CONVERT(date,getdate())
and datepart(hour, TS.Tdate) = h.hh ) as Temperature
from hours h
join [tbl_EnergyMeter] s on datepart(hour, s.CreateDate) = h.hh and  convert(date,s.CreateDate) = convert(date,getdate())
--where s.p1='1003'
group by h.hh
order by h.hh;
END
ELSE IF (@TimeCategory = 'Warm')
    BEGIN
        DECLARE @startDateWarm DATE = DATEADD(MONTH, -1, CONVERT(DATE, GETDATE()))

        ;WITH hours AS (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1 FROM hours WHERE hh < 23
        )
        SELECT 
            h.hh,
            TRY_CAST(SUM(s.KWH) AS DECIMAL(18,2)) AS KWH,
            TRY_CAST(SUM(s.calc_kvah) AS DECIMAL(18,2)) AS KVAH,
            (
                SELECT AVG(TS.Temp_in_degree)
                FROM tbl_transactionTempSensor TS
                INNER JOIN tbl_DeviceDetails D ON TS.Device_ID = D.DeviceIdForExternal
                INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId
                INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId
                WHERE AST.[Description] = 'HVAC'
                  AND TS.Device_ID = 'PE-T-04'
                  AND TS.Tdate BETWEEN @startDateWarm AND GETDATE()
                  AND DATEPART(HOUR, TS.Tdate) = h.hh
            ) AS Temperature
        FROM hours h
        LEFT JOIN tbl_EnergyMeter s 
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND s.CreateDate BETWEEN @startDateWarm AND GETDATE()
        GROUP BY h.hh
        ORDER BY h.hh
    END


    ELSE IF (@TimeCategory = 'Cold')
    BEGIN
        DECLARE @startDateCold DATE =
            CONVERT(DATE, DATEADD(MONTH, -3, GETDATE())
            - (DAY(DATEADD(MONTH, -3, GETDATE())) - 1))

        ;WITH hours AS (
            SELECT 1 AS hh
            UNION ALL
            SELECT hh + 1 FROM hours WHERE hh < 23
        )
        SELECT 
            h.hh,
            TRY_CAST(SUM(s.KWH) AS DECIMAL(18,2)) AS KWH,
            TRY_CAST(SUM(s.calc_kvah) AS DECIMAL(18,2)) AS KVAH,
            (
                SELECT AVG(TS.Temp_in_degree)
                FROM tbl_transactionTempSensor TS
                INNER JOIN tbl_DeviceDetails D ON TS.Device_ID = D.DeviceIdForExternal
                INNER JOIN tbl_Asset A ON A.AssetId = D.AssetId
                INNER JOIN tbl_AssetType AST ON AST.AssetTypeId = A.AssetTypeId
                WHERE AST.[Description] = 'HVAC'
                  AND TS.Device_ID = 'PE-T-04'
                  AND TS.Tdate BETWEEN @startDateCold AND GETDATE()
                  AND DATEPART(HOUR, TS.Tdate) = h.hh
            ) AS Temperature
        FROM hours h
        LEFT JOIN tbl_EnergyMeter s 
            ON DATEPART(HOUR, s.CreateDate) = h.hh
           AND s.CreateDate BETWEEN @startDateCold AND GETDATE()
        GROUP BY h.hh
        ORDER BY h.hh
    END
END

