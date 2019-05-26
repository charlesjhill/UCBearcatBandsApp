using BlazorClient.Shared;
using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace BlazorClient.Services
{
    internal class StudentDataAccess : IStudentDataAccess
    {
        public StudentDataAccess(HttpClient httpClient)
        {
            Client = httpClient;
        }

        protected HttpClient Client { get; set; }

        protected string BaseURI { get; set; } = "http://localhost:8000/students/";

        public async Task AddStudent(Student student)
        {
            await Client.PostJsonBetterAsync(BaseURI, student).ConfigureAwait(false);
        }

        public async Task DeleteStudent(Student student)
        {
            await Client.DeleteAsync($"{BaseURI}{student.ID}/").ConfigureAwait(false);
        }

        public async Task DeleteStudent(int id)
        {
            await Client.DeleteAsync($"{BaseURI}{id}/").ConfigureAwait(false);
        }

        public async Task<Student[]> GetStudents()
        {
            return await Client.GetJsonBetterAsync<Student[]>(BaseURI).ConfigureAwait(false);
        }

        public async Task<Student[]> GetStudents(Dictionary<string, string> queryParams)
        {
            string url = QueryHelpers.AddQueryString(BaseURI, queryParams);
            return await Client.GetJsonBetterAsync<Student[]>(url).ConfigureAwait(false);
        }

        public async Task<Student> RetrieveStudent(int id)
        {
            return await Client.GetJsonBetterAsync<Student>($"{BaseURI}{id}/").ConfigureAwait(false);
        }

        public async Task UpdateStudent(Student student)
        {
            await Client.PutJsonBetterAsync($"{BaseURI}{student.ID}/", student).ConfigureAwait(false);
        }
    }
}
