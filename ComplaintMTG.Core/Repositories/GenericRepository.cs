using ComplaintMGT.Abstractions.DomainModels;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Infrastructure.Data;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMTG.Core.REPOSITORY
{
    public class GenericRepository<T> : IRepository<T> where T : class
    {

        CMGTContext context;
        private DbSet<T> entities;
        private DatabaseOptions _options;

        // FIX 1: Removed 'static' keyword — static fields are shared across all instances
        // and cause race conditions + wrong connection strings in multi-threaded DI scenarios.
        private string connectionString = string.Empty;
        private string belconnectionString = string.Empty;

        public GenericRepository(CMGTContext context, DatabaseOptions databaseOptions)
        {
            this.context = context;
            entities = context.Set<T>();
            _options = databaseOptions;
            connectionString = _options.ConnectionString;
            belconnectionString = _options.ConnectionString;
        }

        #region Core 
        /// <summary>
        /// Core operation
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<T> Add(T entity)
        {
            await context.Set<T>().AddAsync(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task<T> Delete(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            context.Set<T>().Remove(entity);
            await context.SaveChangesAsync();

            return entity;
        }

        public async Task<T> GetById(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> GetAllRow()
        {
            return await context.Set<T>().ToListAsync();
        }

        public IQueryable<T> GetAll()
        {
            return context.Set<T>().AsNoTracking();
        }

        public bool IsExist(Func<T, bool> predicate)
        {
            return context.Set<T>().Any(predicate);
        }

        public T GetDataSingle(Func<T, bool> predicate)
        {
            return context.Set<T>().Where(predicate).FirstOrDefault();
        }

        public async Task<T> Update(T t, object key)
        {
            if (t == null)
                return null;
            T exist = await context.Set<T>().FindAsync(key);
            if (exist != null)
            {
                context.Entry(exist).CurrentValues.SetValues(t);
                await context.SaveChangesAsync();
            }
            return exist;
        }

        #endregion


        #region Ado
        /// <summary>
        /// Get Data From Database
        /// <para>Use it when to retrieve data through a stored procedure</para>
        /// </summary>
        [Obsolete]
        public List<T> ExecuteQuery(string sqlQuery, object[] Param)
        {
            string sql = string.Format(sqlQuery, Param);
            return context.Set<T>().FromSqlRaw(sql).AsEnumerable().ToList();
        }

        /// <summary>
        /// Get Single Data From Database
        /// <para>Use it when to retrieve single data through a stored procedure</para>
        /// </summary>
        [Obsolete]
        public T ExecuteQuerySingle(string spQuery, object[] parameters)
        {
            string sql = string.Format(spQuery, parameters);
            return context.Set<T>().FromSqlRaw(sql).AsEnumerable().FirstOrDefault();
        }

        [Obsolete]
        public string ExecuteQuerySingleDynamic(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Replaced Int32.MaxValue with a reasonable timeout (120s).
                    // Int32.MaxValue (~24 days) causes hung queries to hold connections
                    // open indefinitely, rapidly exhausting the connection pool.
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        sda.Fill(dt);
                        output = DataTableToJsonSingleObj(dt);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string ExecuteQueryDynamicListMultiResultSet(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataSet ds = new DataSet();
                        sda.Fill(ds);
                        output = DataSetToJSONWithJSONNet(ds);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string ExecuteQueryDynamicList(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        
                        sda.Fill(dt);
                        output = DataTableToJSONWithJSONNet(dt);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string ExecuteQuerySingleDataTableDynamic(string spQuery, SqlParameter[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spQuery, con))
                {
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.StoredProcedure;
                    foreach (var item in parameters)
                    {
                        cmd.Parameters.Add(item);
                    }
                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        sda.Fill(dt);
                        output = DataTableToJsonSingleObj(dt);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string ExecuteQuerySingleDataTableDynamicDataset(string spQuery, SqlParameter[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spQuery, con))
                {
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.StoredProcedure;
                    foreach (var item in parameters)
                    {
                        cmd.Parameters.Add(item);
                    }
                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataSet dt = new DataSet();
                        sda.Fill(dt);
                        output = DataSetToJSONWithJSONNet(dt);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string ExecuteQueryDynamicDataset(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataSet dt = new DataSet();
                        sda.Fill(dt);
                        output = DataSetToJSONWithJSONNet(dt);
                    }
                }
            }

            return output;
        }

        /// <summary>
        /// Insert/Update/Delete Data To Database
        /// <para>Use it when to Insert/Update/Delete data through a stored procedure</para>
        /// </summary>
        // FIX 3: The original code had no try/finally, so if any exception was thrown
        // between conn.Open() and conn.Close(), the connection was NEVER returned to the
        // pool. This is the PRIMARY cause of the "max pool size was reached" error.
        // Wrapping in try/finally guarantees the connection is always closed.
        public int ExecuteCommand(string spQuery, object[] parameters)
        {
            var conn = context.Database.GetDbConnection();
            try
            {
                conn.Open();

                var command = conn.CreateCommand();
                command.CommandText = spQuery;
                command.CommandType = CommandType.StoredProcedure;
                // FIX 2: Reasonable timeout instead of leaving it at default/unlimited
                command.CommandTimeout = 120;
                command.Parameters.AddRange(parameters.ToArray());

                var result = command.ExecuteNonQuery();
                command.Dispose();
                return result;
            }
            finally
            {
                // This block ALWAYS runs — even if an exception is thrown above.
                // Ensures the connection is always returned to the pool.
                if (conn.State != ConnectionState.Closed)
                    conn.Close();
            }
        }

        #endregion

        #region Bel Ado

        [Obsolete]
        public string BExecuteQuerySingleDynamic(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(belconnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        sda.Fill(dt);
                        output = DataTableToJsonSingleObj(dt);
                    }
                }
            }

            return output;
        }

        [Obsolete]
        public string BExecuteQueryDynamicList(string spQuery, object[] parameters)
        {
            string output = string.Empty;
            using (SqlConnection con = new SqlConnection(belconnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(string.Format(spQuery, parameters)))
                {
                    cmd.Connection = con;
                    // FIX 2: Reasonable timeout instead of Int32.MaxValue
                    cmd.CommandTimeout = 120;
                    cmd.CommandType = CommandType.Text;

                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        sda.Fill(dt);
                        output = DataTableToJSONWithJSONNet(dt);
                    }
                }
            }

            return output;
        }

        #endregion


        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public string DataTableToJsonObj(DataTable dt)
        {
            DataSet ds = new DataSet();
            ds.Merge(dt);
            StringBuilder JsonString = new StringBuilder();
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                JsonString.Append("[");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    JsonString.Append("{");
                    for (int j = 0; j < ds.Tables[0].Columns.Count; j++)
                    {
                        if (j < ds.Tables[0].Columns.Count - 1)
                        {
                            JsonString.Append("\"" + ds.Tables[0].Columns[j].ColumnName.ToString() + "\":" + "\"" + ds.Tables[0].Rows[i][j].ToString() + "\",");
                        }
                        else if (j == ds.Tables[0].Columns.Count - 1)
                        {
                            JsonString.Append("\"" + ds.Tables[0].Columns[j].ColumnName.ToString() + "\":" + "\"" + ds.Tables[0].Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == ds.Tables[0].Rows.Count - 1)
                    {
                        JsonString.Append("}");
                    }
                    else
                    {
                        JsonString.Append("},");
                    }
                }
                JsonString.Append("]");
                return JsonString.ToString();
            }
            else
            {
                return null;
            }
        }

        public string DataTableToJsonSingleObj(DataTable dt)
        {
            DataSet ds = new DataSet();
            ds.Merge(dt);
            StringBuilder JsonString = new StringBuilder();
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < 1; i++)
                {
                    JsonString.Append("{");
                    for (int j = 0; j < ds.Tables[0].Columns.Count; j++)
                    {
                        if (j < ds.Tables[0].Columns.Count - 1)
                        {
                            JsonString.Append("\"" + ds.Tables[0].Columns[j].ColumnName.ToString() + "\":" + "\"" + ds.Tables[0].Rows[i][j].ToString() + "\",");
                        }
                        else if (j == ds.Tables[0].Columns.Count - 1)
                        {
                            JsonString.Append("\"" + ds.Tables[0].Columns[j].ColumnName.ToString() + "\":" + "\"" + ds.Tables[0].Rows[i][j].ToString() + "\"");
                        }
                    }
                    JsonString.Append("}");
                }
                return JsonString.ToString();
            }
            else
            {
                return null;
            }
        }

        public string DataTableToJSONWithJSONNet(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }

        public string DataSetToJSONWithJSONNet(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }

        public string DataSetToJSONWithJSONNet(DataSet ds)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(ds);
            return JSONString;
        }
    }
}