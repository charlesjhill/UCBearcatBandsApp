# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
The way things are currently swinging, we need a database-backed web API. We have a few options:
- **[ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) - I like this one but it isn't necessarily the best for everyone**
- [Express](https://expressjs.com/) - A JS framework; there's lots of extensions to this we could roll to
- [Django](https://www.djangoproject.com/) - A python web-framework; Could be best for the most people
- [CppCMS](http://cppcms.com/wikipp/en/page/main) - This one is in C++; Probably not as mature as others

For frontends, we are doing two UIs:
- A traditional web application, currently using [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/client).
  - This is not set in stone. Other options include: 
  - [Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-3.0&tabs=visual-studio)
  - [Angular](https://angular.io/) - A Typescript Framework for building UIs; integrates cleanly enough with a ASP.NET backend
  - [React](https://reactjs.org/) - More JS, should also be easy enough.
  - [Vue.JS](https://vuejs.org/) - More JS; Don't know a lot about this one but it could be neat.
  - Plain JS/HTML/CSS - It's an option that we just don't use a web framework at all
- A mobile app, probably for iOS
  - Don't know anything here

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
