using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace BlazorClient.Shared
{
    public class Student
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }

        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("m_number")]
        [RegularExpression(@"M\d{8}", ErrorMessage = "Please include an M followed by 8 digits")]
        public string MNumber { get; set; }

        public string FullName => FirstName + " " + LastName;
    }
}
