# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Set up Information
As it currently stands, the project uses (Blazor)[https://dotnet.microsoft.com/apps/aspnet/web-apps/client] for the web-app client, and an ASP.NET Core WebAPI for the server backend.

To ensure smooth building and development of the backend, you'll want the following two things
- [.NET Core 3.0 Preview 5](https://dotnet.microsoft.com/download/dotnet-core/3.0)
- [Visual Studio 2019 Preview](https://visualstudio.microsoft.com/vs/preview/)
  - During installation, make sure you grab the _ASP.NET and Web Development_ workflow

If you want to muck around with the web app frontend (currently in Blazor), you'll also want to do these two things (in addition to the backend stuff):
- [This](https://marketplace.visualstudio.com/items?itemName=aspnet.blazor) extension
- Then execute the following command:  
  `dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview5-19227-01`

For the mobile app client... Ask Ben
