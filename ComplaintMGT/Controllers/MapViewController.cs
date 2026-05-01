using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace ComplaintMGT.Controllers
{
    public class MapViewController : Controller
    {
        private readonly IConfiguration _configuration;

        public MapViewController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        // ── GET SITES ─────────────────────────────────────────────────────
        [HttpGet]
        [Route("api/MapView/GetMapSites")]
        public IActionResult GetMapSites()
        {
            var result = new List<object>();
            string connectionString = _configuration.GetConnectionString("CKCENTITY");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                string query = @"
                    SELECT SiteId, SiteName, ZoneName, CityName,
                           Longitude, Latitude, IsActive,
                           ISNULL(AddressLine1, '') + 
                           CASE WHEN AddressLine2 IS NOT NULL AND AddressLine2 != '' 
                                THEN ', ' + AddressLine2 ELSE '' END AS Address
                    FROM (
                        SELECT
                            S.SiteId, S.SiteName, Z.ZoneName,
                            C.CityName, S.Longitude, S.Latitude,
                            Z.IsActive, S.AddressLine1, S.AddressLine2,
                            ROW_NUMBER() OVER (PARTITION BY S.SiteId ORDER BY S.SiteId) AS rn
                        FROM [tbl_Site] S
                        INNER JOIN [CityMaster] C ON C.CityId = S.CityId
                        INNER JOIN [tbl_Zone]   Z ON C.CityId = Z.CityId
                        WHERE S.Latitude  IS NOT NULL
                          AND S.Longitude IS NOT NULL
                          AND S.Latitude  != 0
                          AND S.Longitude != 0
                    ) AS T
                    WHERE rn = 1";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            SiteId = reader["SiteId"],
                            SiteName = reader["SiteName"]?.ToString() ?? "",
                            ZoneName = reader["ZoneName"]?.ToString() ?? "",
                            CityName = reader["CityName"]?.ToString() ?? "",
                            Address = reader["Address"]?.ToString() ?? "",
                            Longitude = reader["Longitude"] != DBNull.Value
                                          ? double.Parse(reader["Longitude"].ToString()) : 0.0,
                            Latitude = reader["Latitude"] != DBNull.Value
                                          ? double.Parse(reader["Latitude"].ToString()) : 0.0,
                            IsActive = reader["IsActive"]?.ToString() ?? ""
                        });
                    }
                }
            }
            return Json(result);
        }

        // ── GET ASSETS ────────────────────────────────────────────────────
        [HttpGet]
        [Route("api/MapView/GetMapAssets")]
        public IActionResult GetMapAssets()
        {
            var result = new List<object>();
            string connectionString = _configuration.GetConnectionString("CKCENTITY");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("MapDeatils", conn))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Skip Result Set 1 (Sites)
                        reader.NextResult();

                        // Read Result Set 2 (Assets)
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                SiteId = reader["SiteId"],
                                SiteName = reader["SiteName"]?.ToString() ?? "",
                                CityName = reader["CityName"]?.ToString() ?? "",
                                ZoneName = reader["ZoneName"]?.ToString() ?? "",
                                AssetList = reader["AssetList"]?.ToString() ?? "",
                                Latitude = reader["Latitude"] != DBNull.Value
                                              ? double.Parse(reader["Latitude"].ToString()) : 0.0,
                                Longitude = reader["Longitude"] != DBNull.Value
                                              ? double.Parse(reader["Longitude"].ToString()) : 0.0,
                            });
                        }
                    }
                }
            }
            return Json(result);
        }

        // ── GET DEVICES ───────────────────────────────────────────────────
        [HttpGet]
        [Route("api/MapView/GetMapDevices")]
        public IActionResult GetMapDevices()
        {
            var result = new List<object>();
            string connectionString = _configuration.GetConnectionString("CKCENTITY");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("MapDeatils", conn))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Skip Result Set 1 (Sites)
                        reader.NextResult();

                        // Skip Result Set 2 (Assets)
                        reader.NextResult();

                        // Read Result Set 3 (Devices)
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                SiteId = reader["SiteId"],
                                SiteName = reader["SiteName"]?.ToString() ?? "",
                                CityName = reader["CityName"]?.ToString() ?? "",
                                ZoneName = reader["ZoneName"]?.ToString() ?? "",
                                DeviceList = reader["DeviceList"]?.ToString() ?? "",
                                Latitude = reader["Latitude"] != DBNull.Value
                                               ? double.Parse(reader["Latitude"].ToString()) : 0.0,
                                Longitude = reader["Longitude"] != DBNull.Value
                                               ? double.Parse(reader["Longitude"].ToString()) : 0.0,
                            });
                        }
                    }
                }
            }
            return Json(result);
        }
    }
}