using ComplaintMGT.Abstractions.DomainModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using System;
using System.Net;
using System.Net.Http;
using System.Timers;
using System.Linq;
namespace ComplaintMGT.APISimulator
{
    class Program
    {
        private static bool isRunning = false;
        private static System.Timers.Timer DawnTimer;
        private static int timeInterval = 120; //set time in second 
        private static string baseURL = "http://localhost:59926/"; //API Base URL 
        private static void DawnTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            // Ensure that the method runs only once at time and avoid race conditions
            if (!isRunning)
            {
                isRunning = true;
                CallAPIEndpoint();
                isRunning = false;
            }

            // Calculate the time until the next time and reset the timer
            DateTime now = DateTime.Now;
            DateTime nextInterval = now.AddSeconds(timeInterval);
            TimeSpan timeUntilNextInterval = nextInterval - now;
            DawnTimer.Interval = timeUntilNextInterval.TotalMilliseconds;
        }
        private static void CallAPIEndpoint()
        {
            Console.WriteLine($"\n The method was executed in {DateTime.Now} this time. ");

            string endpoint = "api/Data/GetData";
            var result = GetSingleItemRequest(endpoint);
            var energyList = (List<EnergyData>)JsonConvert.DeserializeObject<List<EnergyData>>(result);
            var latestData = energyList.OrderByDescending(x => x.EnergyMeterId).Take(1).FirstOrDefault();
            //Save Energy Data
            var p3 = "1";//power factor 
            var p13 = Convert.ToDecimal(latestData.p13) + 100; //Cumulative Energy
            var p14 = Convert.ToDecimal(latestData.p14) + 100; //Run Hrs
            endpoint = "api/Data/Save?p1=test&p2=1001&p3=" + p3 + "&p4=4&p5=5&p6=6&p7=7&p8=8&p9=9&p10=10&p11=11&p12=12&p13=" + p13 + "&p14=" + p14 + "&p15=15&p16=16&p17=17&p18=18&p19=19&p20=20&p21=21&p22=22&p23=23&p24=24&p25=25&p26=26&p27=27&p28=28&p29=29&p30=30&p31=31&p32=32&p33=33&p34=34&p35=35&p36=36&p37=37&p38=38&p39=39&p40=40&p41=41&p42=42";
            result = GetSingleItemRequest(endpoint);
            //Save Sensor Data
            //InputData will be a string in comma separeted @Temp_in_degree,@Temp_in_Fahrenheit,@Device_ID,@Reserve_value
            endpoint = "api/DeviceTransaction/PushTempSensorData?InputData=101.00,50.00,4C752538123B,rs2";
            result = GetSingleItemRequest(endpoint);
        }

        static void Main(string[] args)
        {
            //Check at startup
            DateTime now = DateTime.Now;
            DateTime nextMidnight = now.AddSeconds(timeInterval);
            TimeSpan timeUntilMidnight = nextMidnight - now;

            DawnTimer = new System.Timers.Timer(timeUntilMidnight.TotalMilliseconds);
            DawnTimer.Elapsed += DawnTimer_Elapsed;
            DawnTimer.Start();

            Console.WriteLine("Program started. The method will run in every 2 minute");
            Console.ReadLine();
        }

        static dynamic GetSingleItemRequest(string apiUrl)
        {
            string endpoint = baseURL + apiUrl;
            var result1 = default(T);
            using (HttpClient client = new HttpClient())
            {
                using (var Response = client.GetAsync(endpoint))
                {
                    Response.Wait();
                    var result = Response.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsStringAsync();
                        readTask.Wait();
                        return readTask.Result;
                    }
                }
            }
            return result1;
        }
    }
}
