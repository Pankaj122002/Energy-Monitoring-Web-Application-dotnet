USE [pe_db_complaintMGT]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_CumulativeEnergyConsumptionLive]    Script Date: 3/24/2026 1:07:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Hot',490654
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Warm'
[sp_EnergyTrends_CumulativeEnergyConsumptionLive] 'Cold'

Select * from tbl_EnergyMeter where EnergyMeterId>490654

*/

CREATE  procedure [dbo].[sp_EnergyTrends_CumulativeEnergyConsumptionLive]
   @TimeCategory VARCHAR(20),
    @Meter varchar (255),
    @Mainmeter varchar(255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        SET @EndDate   = GETDATE()-50;
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
        SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS Date) AS [Date],
                CAST(EM.CreateDate AS TIME(0)) AS [Time],
                Case when EM.p2 = @Mainmeter then Round(ABS(EM.p13),2)
                ELSE Round(ABS(EM.p3),2) END AS KWH,
                Round(ABS(EM.p18),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
              order by EM.p2,CAST(EM.CreateDate AS Date),CAST(EM.CreateDate AS TIME(0))
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
           WITH CTE AS (
    SELECT
        EM.p2 AS MeterID,
        CAST(EM.CreateDate AS DATE) AS [Date],
        CAST(EM.CreateDate AS TIME(0)) AS [Time],
        CASE 
            WHEN EM.p2 = @Mainmeter THEN ROUND(ABS(EM.p13), 2)
            ELSE ROUND(ABS(EM.p3), 2) 
        END AS KWH,
        ROUND(ABS(EM.p18), 2) AS KVAH,
        
        ROW_NUMBER() OVER (
            PARTITION BY EM.p2, CAST(EM.CreateDate AS DATE)
            ORDER BY EM.CreateDate ASC
        ) AS rn

    FROM tbl_EnergyMeter EM
    WHERE EM.CreateDate BETWEEN @StartDate and @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))
)

SELECT 
    MeterID,
    [Date],
    [Time],
    KWH,
    KVAH
FROM CTE
WHERE rn = 1
ORDER BY MeterID, [Date];

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
          WITH CTE AS (
    SELECT
        EM.p2 AS MeterID,
        CAST(EM.CreateDate AS DATE) AS [Date],
        CAST(EM.CreateDate AS TIME(0)) AS [Time],

        CASE 
            WHEN EM.p2 = @Mainmeter THEN ROUND(ABS(EM.p13), 2)
            ELSE ROUND(ABS(EM.p3), 2) 
        END AS KWH,

        ROUND(ABS(EM.p18), 2) AS KVAH,

        DATEPART(YEAR, EM.CreateDate) AS [Year],
        DATEPART(WEEK, EM.CreateDate) AS [WeekNo],

        ROW_NUMBER() OVER (
            PARTITION BY EM.p2, DATEPART(YEAR, EM.CreateDate), DATEPART(WEEK, EM.CreateDate)
            ORDER BY EM.CreateDate ASC
        ) AS rn

    FROM tbl_EnergyMeter EM
    WHERE EM.CreateDate BETWEEN @StartDate and @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))
)

SELECT
    MeterID,
    [Date],
    [Time],
    KWH,
    KVAH,
    [Year],
    [WeekNo]
FROM CTE
WHERE rn = 1
ORDER BY MeterID, [Year], [WeekNo];
        

END

END



GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = GETDATE()-41;
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
        ;WITH EnergyData AS
        (
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
        ),

        --Fetching the hourly avg of temp for assets(DeviceID) mapped with given meter
        TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                DATEPART(HOUR, TS.Tdate) AS HourSlot,
                MA.Asset,
                TS.Device_ID,
                Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
            GROUP BY
            S.MeterDisplayname,
                CAST(TS.Tdate AS DATE),
                DATEPART(HOUR, TS.Tdate),
                TS.Device_ID,
                MA.Asset
        )

        --Now combining both energy and tmep table data with full outer join to show them together
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            COALESCE(E.HourSlot,T.HourSlot) As HourSlot,
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset ,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
   AND E.HourSlot = T.HourSlot
        ORDER BY 
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            COALESCE(E.HourSlot,T.HourSlot), 
            E.MeterID,
            T.Device_ID
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
    ;With EnergyData AS
    (          Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
),TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                MA.Asset,
                TS.Device_ID,
                Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS 
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
            GROUP BY
                S.MeterDisplayname,
                CAST(TS.Tdate AS DATE),
                TS.Device_ID,
                MA.Asset
                
        )
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset AS Asset,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
        ORDER BY  
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            T.Device_ID
    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

    -----------------------------------------------------
    -- ENERGY DATA (Weekly inside month)
    -----------------------------------------------------

    ;WITH EnergyData AS
    (
        SELECT
            EM.p2 AS MeterID,

            -- Month-bound WeekStart
            DATEADD
            (
                DAY,
                ((DAY(EM.CreateDate)-1)/7)*7,
                DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
            ) AS WeekStart,

            Round(SUM(ABS(EM.KWH)),2) AS KWH,
            Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH

        FROM tbl_EnergyMeter EM

        WHERE EM.CreateDate >= @StartDate
        AND EM.CreateDate <= @EndDate
        AND EM.p2 in (Select value from STRING_SPLIT (@Meter,','))

        GROUP BY
            EM.p2,
            DATEADD
            (
                DAY,
                ((DAY(EM.CreateDate)-1)/7)*7,
                DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
            )
    ),

    -----------------------------------------------------
    -- TEMPERATURE DATA
    -----------------------------------------------------

    TempData AS
    (
        SELECT
        S.MeterDisplayname AS MeterID,

            DATEADD
            (
                DAY,
                ((DAY(TS.Tdate)-1)/7)*7,
                DATEFROMPARTS(YEAR(TS.Tdate), MONTH(TS.Tdate), 1)
            ) AS WeekStart,

            MA.Asset,
            TS.Device_ID,

            Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree

        FROM tbl_transactionTempSensor TS

        INNER JOIN tbl_DeviceDetails DD 
            ON TS.Device_ID = DD.DeviceIdForExternal

        LEFT JOIN tbl_MeterAssetMapping MA 
            ON MA.assetID = DD.AssetID

        INNER JOIN tbl_sitemeter S 
            ON S.Sitemeterid = MA.SitemeterId
            AND S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))

        WHERE TS.Tdate >= @StartDate
        AND TS.Tdate <= @EndDate

        GROUP BY
        S.MeterDisplayname,
            DATEADD
            (
                DAY,
                ((DAY(TS.Tdate)-1)/7)*7,
                DATEFROMPARTS(YEAR(TS.Tdate), MONTH(TS.Tdate), 1)
            ),
            TS.Device_ID,
            MA.Asset
    )

    -----------------------------------------------------
    -- FINAL SELECT
    -----------------------------------------------------

    SELECT

        -- Month derived from WeekStart (IMPORTANT)
        DATENAME(MONTH, COALESCE(E.WeekStart, T.WeekStart))
        + '-' +
        CAST(YEAR(COALESCE(E.WeekStart, T.WeekStart)) AS VARCHAR) AS Month,

        COALESCE(E.WeekStart, T.WeekStart) AS WeekStart,

        -- WeekEnd (never crosses month)
        CASE 
            WHEN DATEADD(DAY,6,COALESCE(E.WeekStart, T.WeekStart)) >
                 EOMONTH(COALESCE(E.WeekStart, T.WeekStart))
            THEN EOMONTH(COALESCE(E.WeekStart, T.WeekStart))
            ELSE DATEADD(DAY,6,COALESCE(E.WeekStart, T.WeekStart))
        END AS WeekEnd,

        COALESCE(E.MeterID, T.MeterID) AS Meter,
        ISNULL(E.KWH,0) AS KWH,
        ISNULL(E.KVAH,0) AS KVAH,
        T.Asset,
        T.Temp_in_degree,
        T.Device_ID

    FROM EnergyData E
    Full outer JOIN TempData T
    ON E.MeterID = T.MeterID 
        AND E.WeekStart = T.WeekStart

    ORDER BY
        COALESCE(E.MeterID, T.MeterID),
        COALESCE(E.WeekStart, T.WeekStart),
        T.Device_ID;

END




END

GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = GETDATE()-41;
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
        ;WITH EnergyData AS
        (
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
        ),

        --Fetching the hourly avg of temp for assets(DeviceID) mapped with given meter
        TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                DATEPART(HOUR, TS.Tdate) AS HourSlot,
                MA.Asset,
                TS.Device_ID,
                Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
            GROUP BY
            S.MeterDisplayname,
                CAST(TS.Tdate AS DATE),
                DATEPART(HOUR, TS.Tdate),
                TS.Device_ID,
                MA.Asset
        )

        --Now combining both energy and tmep table data with full outer join to show them together
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            COALESCE(E.HourSlot,T.HourSlot) As HourSlot,
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset ,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
   AND E.HourSlot = T.HourSlot
        ORDER BY 
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            COALESCE(E.HourSlot,T.HourSlot), 
            E.MeterID,
            T.Device_ID
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
    ;With EnergyData AS
    (          Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
),TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                MA.Asset,
                TS.Device_ID,
                Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS 
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
            GROUP BY
                S.MeterDisplayname,
                CAST(TS.Tdate AS DATE),
                TS.Device_ID,
                MA.Asset
                
        )
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset AS Asset,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
        ORDER BY  
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            T.Device_ID
    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

    -----------------------------------------------------
    -- ENERGY DATA (Weekly inside month)
    -----------------------------------------------------

    ;WITH EnergyData AS
    (
        SELECT
            EM.p2 AS MeterID,

            -- Month-bound WeekStart
            DATEADD
            (
                DAY,
                ((DAY(EM.CreateDate)-1)/7)*7,
                DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
            ) AS WeekStart,

            Round(AVG(ABS(EM.KWH)),2) AS KWH,
            Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH

        FROM tbl_EnergyMeter EM

        WHERE EM.CreateDate >= @StartDate
        AND EM.CreateDate <= @EndDate
        AND EM.p2 in (Select value from STRING_SPLIT (@Meter,','))

        GROUP BY
            EM.p2,
            DATEADD
            (
                DAY,
                ((DAY(EM.CreateDate)-1)/7)*7,
                DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
            )
    ),

    -----------------------------------------------------
    -- TEMPERATURE DATA
    -----------------------------------------------------

    TempData AS
    (
        SELECT
        S.MeterDisplayname AS MeterID,

            DATEADD
            (
                DAY,
                ((DAY(TS.Tdate)-1)/7)*7,
                DATEFROMPARTS(YEAR(TS.Tdate), MONTH(TS.Tdate), 1)
            ) AS WeekStart,

            MA.Asset,
            TS.Device_ID,

            Cast(Round(AVG(TS.Temp_in_degree),2) as decimal(5,2)) AS Temp_in_degree

        FROM tbl_transactionTempSensor TS

        INNER JOIN tbl_DeviceDetails DD 
            ON TS.Device_ID = DD.DeviceIdForExternal

        LEFT JOIN tbl_MeterAssetMapping MA 
            ON MA.assetID = DD.AssetID

        INNER JOIN tbl_sitemeter S 
            ON S.Sitemeterid = MA.SitemeterId
            AND S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))

        WHERE TS.Tdate >= @StartDate
        AND TS.Tdate <= @EndDate

        GROUP BY
        S.MeterDisplayname,
            DATEADD
            (
                DAY,
                ((DAY(TS.Tdate)-1)/7)*7,
                DATEFROMPARTS(YEAR(TS.Tdate), MONTH(TS.Tdate), 1)
            ),
            TS.Device_ID,
            MA.Asset
    )

    -----------------------------------------------------
    -- FINAL SELECT
    -----------------------------------------------------

    SELECT

        -- Month derived from WeekStart (IMPORTANT)
        DATENAME(MONTH, COALESCE(E.WeekStart, T.WeekStart))
        + '-' +
        CAST(YEAR(COALESCE(E.WeekStart, T.WeekStart)) AS VARCHAR) AS Month,

        COALESCE(E.WeekStart, T.WeekStart) AS WeekStart,

        -- WeekEnd (never crosses month)
        CASE 
            WHEN DATEADD(DAY,6,COALESCE(E.WeekStart, T.WeekStart)) >
                 EOMONTH(COALESCE(E.WeekStart, T.WeekStart))
            THEN EOMONTH(COALESCE(E.WeekStart, T.WeekStart))
            ELSE DATEADD(DAY,6,COALESCE(E.WeekStart, T.WeekStart))
        END AS WeekEnd,

        COALESCE(E.MeterID, T.MeterID) AS Meter,
        ISNULL(E.KWH,0) AS KWH,
        ISNULL(E.KVAH,0) AS KVAH,
        T.Asset,
        T.Temp_in_degree,
        T.Device_ID

    FROM EnergyData E
    Full outer JOIN TempData T
    ON E.MeterID = T.MeterID 
        AND E.WeekStart = T.WeekStart

    ORDER BY
        COALESCE(E.MeterID, T.MeterID),
        COALESCE(E.WeekStart, T.WeekStart),
        T.Device_ID;

END




END

GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureLive]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureLive]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = GETDATE()-50;
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
        ;WITH EnergyData AS
        (
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS Date) AS [Date],
                CAST(EM.CreateDate AS TIME(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
        ),

        --Fetching the hourly avg of temp for assets(DeviceID) mapped with given meter
        TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                CAST(TS.Tdate AS TIME(0)) AS [Time],
                MA.Asset,
                TS.Device_ID,
                Cast(Round(TS.Temp_in_degree,2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
        )

        --Now combining both energy and tmep table data with full outer join to show them together
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            COALESCE(E.[Time],T.[Time]) As [Time],
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset ,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
   and E.[Time] = T.[Time]
        ORDER BY 
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            COALESCE(E.[Time],T.[Time]),
            E.MeterID,
            T.Device_ID
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
    ;With EnergyData AS
    (          Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                CAST(EM.CreateDate AS Time(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
),TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                CAST(TS.Tdate AS Time(0)) AS [Time],
                MA.Asset,
                TS.Device_ID,
                Cast(Round(TS.Temp_in_degree,2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS 
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
                
        )
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            COALESCE(E.[Time],T.[Time]) As [Time],
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset AS Asset,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
        ORDER BY  
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            COALESCE(E.[Time],T.[Time]),
            T.Device_ID
    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
        ;WITH EnergyData AS
        (
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS Date) AS [Date],
                CAST(EM.CreateDate AS TIME(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
        ),

        --Fetching the hourly avg of temp for assets(DeviceID) mapped with given meter
        TempData AS
        (
            SELECT
            S.MeterDisplayname AS MeterID,
                CAST(TS.Tdate AS DATE) AS [Date],
                CAST(TS.Tdate AS TIME(0)) AS [Time],
                MA.Asset,
                TS.Device_ID,
                Cast(Round(TS.Temp_in_degree,2) as decimal(5,2)) AS Temp_in_degree
            FROM tbl_transactionTempSensor TS
            inner join [tbl_DeviceDetails] DD on TS.Device_ID = DD.DeviceIdForExternal
            inner join [tbl_MeterAssetMapping] MA on MA.assetID = DD.AssetID
            inner join [tbl_sitemeter] S on S.Sitemeterid = MA.SitemeterId and S.MeterDisplayname in (Select value from STRING_SPLIT (@Meter,','))
            WHERE TS.Tdate between @StartDate AND @EndDate
        )

        --Now combining both energy and tmep table data with full outer join to show them together
        SELECT
            COALESCE(E.MeterID, T.MeterID) AS Meter,
            COALESCE(E.[Date],T.[Date]) As [Date],
            COALESCE(E.[Time],T.[Time]) As [Time],
            ISNULL(E.KWH, 0) AS KWH,
            ISNULL(E.KVAH, 0) AS KVAH,
            T.Asset ,
            T.Temp_in_degree,
            T.Device_ID AS DeviceID
        FROM TempData T
        Full outer JOIN EnergyData E
    ON E.MeterID = T.MeterID
   AND E.[Date] = T.[Date]
   and E.[Time] = T.[Time]
        ORDER BY 
            COALESCE(E.MeterID, T.MeterID),
            COALESCE(E.[Date],T.[Date]), 
            COALESCE(E.[Time],T.[Time]),
            E.MeterID,
            T.Device_ID

END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionHourlyActual]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionHourlyActual]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS

BEGIN

    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -41, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
SET @EndDate   = GETDATE();


SELECT
    EM.p2 AS MeterID,

    W.[Year],
    W.[WeekNo],

    DATENAME(MONTH, W.WeekStart) AS [Month],
    W.WeekStart,

    -- WeekEnd (within same month)
    CASE 
        WHEN DATEADD(DAY, 6, W.WeekStart) > EOMONTH(W.WeekStart)
        THEN EOMONTH(W.WeekStart)
        ELSE DATEADD(DAY, 6, W.WeekStart)
    END AS WeekEnd,

    ROUND(SUM(ABS(EM.KWH)),2) AS KWH,
    ROUND(SUM(ABS(EM.calc_kvah)),2) AS KVAH

FROM tbl_EnergyMeter EM

CROSS APPLY (
    SELECT 
        DATEADD(
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        YEAR(EM.CreateDate) AS [Year],

        -- Week number inside month (1 to 5)
        ((DAY(EM.CreateDate)-1)/7) + 1 AS WeekNo
) W

WHERE EM.CreateDate BETWEEN @StartDate AND @EndDate
  AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))

GROUP BY
    EM.p2,
    W.[Year],
    W.[WeekNo],
    W.WeekStart

ORDER BY
    EM.p2,
    W.[Year],
    W.[WeekNo];

END


END
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionHourlyAverage]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionHourlyAverage]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -41, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

SELECT
    EM.p2 AS MeterID,

    W.[Year],
    W.[WeekNo],

    DATENAME(MONTH, W.WeekStart) AS [Month],
    W.WeekStart,

    -- WeekEnd (within same month)
    CASE 
        WHEN DATEADD(DAY, 6, W.WeekStart) > EOMONTH(W.WeekStart)
        THEN EOMONTH(W.WeekStart)
        ELSE DATEADD(DAY, 6, W.WeekStart)
    END AS WeekEnd,

    ROUND(AVG(ABS(EM.KWH)),2) AS KWH,
    ROUND(AVG(ABS(EM.calc_kvah)),2) AS KVAH

FROM tbl_EnergyMeter EM

CROSS APPLY (
    SELECT 
        DATEADD(
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        YEAR(EM.CreateDate) AS [Year],

        -- Week number inside month (1 to 5)
        ((DAY(EM.CreateDate)-1)/7) + 1 AS WeekNo
) W

WHERE EM.CreateDate BETWEEN @StartDate AND @EndDate
  AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))

GROUP BY
    EM.p2,
    W.[Year],
    W.[WeekNo],
    W.WeekStart

ORDER BY
    EM.p2,
    W.[Year],
    W.[WeekNo];

END


END
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionLive]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionLive]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -50, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

    
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS Date) AS [Date],
                CAST(EM.CreateDate AS TIME(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
              Order by EM.p2 , CAST(EM.CreateDate AS Date),CAST(EM.CreateDate AS Time(0))
       
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-30), MONTH(GETDATE()-30), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                CAST(EM.CreateDate AS Time(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
              Order by EM.p2 , CAST(EM.CreateDate AS Date),CAST(EM.CreateDate AS Time(0))

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

     
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS Date) AS [Date],
                CAST(EM.CreateDate AS TIME(0)) AS [Time],
                Round(ABS(EM.KWH),2) AS KWH,
                Round(ABS(EM.calc_kvah),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
              Order by EM.p2 , CAST(EM.CreateDate AS Date),CAST(EM.CreateDate AS Time(0))
        

END




END






GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyActual]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyActual]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -43, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-40), MONTH(GETDATE()-40), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

-----------------------------------------------------
-- ENERGY DATA (Weekly inside month)
-----------------------------------------------------
WITH CTE AS
(
    SELECT
        EM.p2 AS MeterID,

        DATEADD(
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        EM.KWH,
        EM.calc_kvah

    FROM tbl_EnergyMeter EM
    WHERE EM.CreateDate >= @StartDate
      AND EM.CreateDate <= @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))
)

SELECT
    MeterID,
    WeekStart,

    -- ✅ SAFE (no CreateDate used)
    DATENAME(MONTH, WeekStart) AS [Month],
    YEAR(WeekStart) AS [Year],

    -- WeekEnd
    CASE 
        WHEN DATEADD(DAY, 6, WeekStart) > EOMONTH(WeekStart)
        THEN EOMONTH(WeekStart)
        ELSE DATEADD(DAY, 6, WeekStart)
    END AS WeekEnd,

    ROUND(SUM(ABS(KWH)),2) AS KWH,
    ROUND(SUM(ABS(calc_kvah)),2) AS KVAH

FROM CTE

GROUP BY
    MeterID,
    WeekStart

ORDER BY
    MeterID,
    WeekStart;

END


END





GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyAverage]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyAverage]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -41, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-40), MONTH(GETDATE()-40), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
    SET @EndDate   = GETDATE();

  -----------------------------------------------------
-- ENERGY DATA (Weekly inside month)
-----------------------------------------------------
WITH CTE AS
(
    SELECT
        EM.p2 AS MeterID,

        DATEADD(
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        EM.KWH,
        EM.calc_kvah

    FROM tbl_EnergyMeter EM
    WHERE EM.CreateDate >= @StartDate
      AND EM.CreateDate <= @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter, ','))
)

SELECT
    MeterID,
    WeekStart,

    -- ✅ SAFE (no CreateDate used)
    DATENAME(MONTH, WeekStart) AS [Month],
    YEAR(WeekStart) AS [Year],

    -- WeekEnd
    CASE 
        WHEN DATEADD(DAY, 6, WeekStart) > EOMONTH(WeekStart)
        THEN EOMONTH(WeekStart)
        ELSE DATEADD(DAY, 6, WeekStart)
    END AS WeekEnd,

    ROUND(AVG(ABS(KWH)),2) AS KWH,
    ROUND(AVG(ABS(calc_kvah)),2) AS KVAH

FROM CTE

GROUP BY
    MeterID,
    WeekStart

ORDER BY
    MeterID,
    WeekStart;

END


END





GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyProfileHourlyActual]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyProfileHourlyActual]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -41, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-40), MONTH(GETDATE()-40), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(SUM(ABS(EM.KWH)),2) AS KWH,
                Round(SUM(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

    SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
SET @EndDate   = GETDATE();

;WITH EnergyData AS
(
    SELECT
        EM.p2 AS MeterID,

        -- WeekStart (month bounded)
        DATEADD
        (
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        ROUND(SUM(ABS(EM.KWH)),2) AS KWH,
        ROUND(SUM(ABS(EM.calc_kvah)),2) AS KVAH

    FROM tbl_EnergyMeter EM

    WHERE EM.CreateDate >= @StartDate
      AND EM.CreateDate <= @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter,','))

    GROUP BY
        EM.p2,
        DATEADD
        (
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        )
)

SELECT
    MeterID,

    -- Month Name
    DATENAME(MONTH, WeekStart) AS [Month],

    -- Year
    YEAR(WeekStart) AS [Year],

    WeekStart,

    -- WeekEnd (restricted within same month)
    CASE 
        WHEN DATEADD(DAY, 6, WeekStart) > EOMONTH(WeekStart)
        THEN EOMONTH(WeekStart)
        ELSE DATEADD(DAY, 6, WeekStart)
    END AS WeekEnd,

    KWH,
    KVAH

FROM EnergyData
ORDER BY MeterID, WeekStart;

END


END
GO
/****** Object:  StoredProcedure [dbo].[sp_EnergyTrends_EnergyProfileHourlyAverage]    Script Date: 3/24/2026 1:07:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_EnergyTrends_EnergyProfileHourlyAverage]
    @TimeCategory VARCHAR(20),
    @Meter varchar (255)
AS
BEGIN
    SET NOCOUNT ON;

 --Declare the date range 
    DECLARE @StartDate DATETIME;
    DECLARE @EndDate   DATETIME;

    --HOT DATA START with if condition taking timecategory parameter
    IF (@TimeCategory = 'Hot')
    BEGIN
        
        --Set the declared date range for one day 
        SET @EndDate   = DATEADD(DAY, -41, GETDATE());
        SET @StartDate = CAST(@EndDate AS DATE);

        --Fetching the Hourly sum of KWH and KVAH from energymeter table for particular meter provided through parameter
      
            SELECT
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                DATEPART(HOUR, EM.CreateDate) AS HourSlot,
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate and @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
            EM.p2,
                CAST(EM.CreateDate AS DATE),
                DATEPART(HOUR, EM.CreateDate)
                Order by EM.p2,CAST(EM.CreateDate AS DATE) , DATEPART(HOUR, EM.CreateDate)
        
    END
-------------------------------------HOT DATA END---------------------------------------

--WARM DATA START 
--to show daily data for current month with same logic as in hot 
    ELSE IF (@TimeCategory = 'Warm')
    BEGIN
    SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()-40), MONTH(GETDATE()-40), 1);
    SET @EndDate = GETDATE();
            Select
                EM.p2 AS MeterID,
                CAST(EM.CreateDate AS DATE) AS [Date],
                Round(AVG(ABS(EM.KWH)),2) AS KWH,
                Round(AVG(ABS(EM.calc_kvah)),2) AS KVAH
            FROM tbl_EnergyMeter EM
            WHERE CreateDate between @StartDate AND @EndDate
              and EM.p2 in (Select value from STRING_SPLIT (@Meter,','))
            GROUP BY
                CAST(EM.CreateDate AS DATE),
                EM.p2
                Order by EM.p2,CAST(EM.CreateDate AS DATE)

    END
    -------------------------------------- END---------------------------------------------


    -----------------------------COLD DATA START-------------------------------------------- 
    --to show data weekly for current month + last 3 months
ELSE IF (@TimeCategory = 'Cold')
BEGIN

       SET @StartDate = DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
SET @EndDate   = GETDATE();

;WITH EnergyData AS
(
    SELECT
        EM.p2 AS MeterID,

        -- WeekStart (month bounded)
        DATEADD
        (
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        ) AS WeekStart,

        ROUND(AVG(ABS(EM.KWH)),2) AS KWH,
        ROUND(AVG(ABS(EM.calc_kvah)),2) AS KVAH

    FROM tbl_EnergyMeter EM

    WHERE EM.CreateDate >= @StartDate
      AND EM.CreateDate <= @EndDate
      AND EM.p2 IN (SELECT value FROM STRING_SPLIT(@Meter,','))

    GROUP BY
        EM.p2,
        DATEADD
        (
            DAY,
            ((DAY(EM.CreateDate)-1)/7)*7,
            DATEFROMPARTS(YEAR(EM.CreateDate), MONTH(EM.CreateDate), 1)
        )
)

SELECT
    MeterID,

    -- Month Name
    DATENAME(MONTH, WeekStart) AS [Month],

    -- Year
    YEAR(WeekStart) AS [Year],

    WeekStart,

    -- WeekEnd (restricted within same month)
    CASE 
        WHEN DATEADD(DAY, 6, WeekStart) > EOMONTH(WeekStart)
        THEN EOMONTH(WeekStart)
        ELSE DATEADD(DAY, 6, WeekStart)
    END AS WeekEnd,

    KWH,
    KVAH

FROM EnergyData
ORDER BY MeterID, WeekStart;

END


END
GO
