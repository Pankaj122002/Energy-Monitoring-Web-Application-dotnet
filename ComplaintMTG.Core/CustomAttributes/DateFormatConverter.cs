using Newtonsoft.Json.Converters;

namespace ComplaintMGT.Core.CustomAttributes
{
    class DateFormatConverter : IsoDateTimeConverter
    {
        public DateFormatConverter()
        {
            DateTimeFormat = "dd/MMM/yyyy";
        }

    }

    class DateWithTimeStampFormatConverter : IsoDateTimeConverter
    {
        public DateWithTimeStampFormatConverter()
        {
            DateTimeFormat = "dd/MMM/yyyy HH:mm:ss";
        }

    }
}
