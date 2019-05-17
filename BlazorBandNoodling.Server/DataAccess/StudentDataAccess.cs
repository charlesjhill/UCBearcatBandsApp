using BlazorBandNoodling.Shared.Models;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace BlazorBandNoodling.Server.DataAccess
{
    public static class StudentDataAccess
    {
        private static HttpClient httpClient = new HttpClient();
        private static Uri BaseUri = new Uri("api/Students");

        public static async Task PostStudent(Student student)
        {
            await httpClient.PostJsonAsync(BaseUri.ToString(), student);
        }
    }
}
