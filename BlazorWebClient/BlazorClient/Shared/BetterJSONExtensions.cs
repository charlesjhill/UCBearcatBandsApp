using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BlazorClient.Shared
{
    /// <summary>
    /// A copy of the HttpClientJsonExtensions, but made better by using Newtonsoft.Json instead of the JSInterop.Json classes
    /// </summary>
    public static class BetterJSONExtensions
    {
        public static async Task<T> GetJsonBetterAsync<T>(this HttpClient httpClient, string requestUri)
        {
            var responseJson = await httpClient.GetStringAsync(requestUri);
            return JsonConvert.DeserializeObject<T>(responseJson);
        }

        public static async Task PostJsonBetterAsync(this HttpClient httpClient, string requestUri, object content)
            => await httpClient.SendJsonBetterAsync(HttpMethod.Post, requestUri, content);

        public static async Task<T> PostJsonBetterAsync<T>(this HttpClient httpClient, string requestUri, object content)
            => await httpClient.SendJsonBetterAsync<T>(HttpMethod.Post, requestUri, content);

        public static async Task PutJsonBetterAsync(this HttpClient httpClient, string requestUri, object content)
            => await httpClient.SendJsonBetterAsync(HttpMethod.Put, requestUri, content);

        public static async Task<T> PutJsonBetterAsync<T>(this HttpClient httpClient, string requestUri, object content)
            => await httpClient.SendJsonBetterAsync<T>(HttpMethod.Put, requestUri, content);

        public static Task SendJsonBetterAsync(this HttpClient httpClient, HttpMethod method, string requestUri, object content)
            => httpClient.SendJsonBetterAsync<IgnoreResponse>(method, requestUri, content);

        public static async Task<T> SendJsonBetterAsync<T>(this HttpClient httpClient, HttpMethod method, string requestUri, object content)
        {
            var requestJson = JsonConvert.SerializeObject(content);
            var response = await httpClient.SendAsync(new HttpRequestMessage(method, requestUri)
            {
                Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
            });

            // Make sure the call was successful before we
            // attempt to process the response content
            response.EnsureSuccessStatusCode();

            if (typeof(T) == typeof(IgnoreResponse))
            {
                return default;
            }
            else
            {
                var responseJson = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(responseJson);
            }
        }

        class IgnoreResponse {  }
    }
}
