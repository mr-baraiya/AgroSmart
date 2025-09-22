using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using System.Net.Http;
using System.Threading.Tasks;

namespace AgroSmartBeackend.Middleware
{
    public class PrerenderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly HttpClient _httpClient;
        private readonly string _prerenderToken;

        public PrerenderMiddleware(RequestDelegate next, string prerenderToken)
        {
            _next = next;
            _prerenderToken = prerenderToken;
            _httpClient = new HttpClient();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var userAgent = context.Request.Headers["User-Agent"].ToString();
            var url = context.Request.GetEncodedUrl();

            // Only prerender for search engine crawlers
            if (IsCrawler(userAgent) && context.Request.Method == HttpMethods.Get)
            {
                var prerenderUrl = $"https://service.prerender.io/{url}";
                var request = new HttpRequestMessage(HttpMethod.Get, prerenderUrl);
                request.Headers.Add("X-Prerender-Token", _prerenderToken);

                var response = await _httpClient.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();

                context.Response.ContentType = "text/html";
                await context.Response.WriteAsync(content);
                return;
            }

            await _next(context);
        }

        private bool IsCrawler(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return false;

            string[] crawlers = new[]
            {
            "Googlebot", "Bingbot", "Yahoo", "DuckDuckBot", "Baiduspider",
            "YandexBot", "Sogou", "facebot", "ia_archiver"
        };

            foreach (var crawler in crawlers)
            {
                if (userAgent.Contains(crawler)) return true;
            }
            return false;
        }
    }
}
