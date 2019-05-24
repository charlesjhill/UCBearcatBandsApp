# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
---
The way things are currently swinging, we need a database-backed web API. The current play is with this one:
- [Django](https://www.djangoproject.com/) - A "batteries-included" python web-framework
  - To make coding a proper API easier, [Djano-Rest-Framework](https://www.django-rest-framework.org/) is hella nice.

For frontends, we are doing two UIs:
- A traditional web application. We are currently using [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/client), a framework for making Single-Page Applications (SPAs) using C#/.NET. We have other options though:
  - [Django?](https://docs.djangoproject.com/en/2.2/topics/templates/) - Django Templates would allow for us to create a rudimentary web-frontend, but it's unclear exactly how it would mesh with the REST API or if it is suitable for SPAs like the other options. We should research this.
  - [Angular](https://angular.io/) - A Typescript Framework for web applications; Mature and tested. Supported by Google Open Source
  - [React](https://reactjs.org/) - "A JS library for building UIs" - Supported by Facebook Open Source
  - [Vue.JS](https://vuejs.org/) - "Approachable, versatile, performant " - Newcomer with regards to these things, but it's pretty poppin on GitHub.
- A mobile app
  - Ben is most comfortable with iOS development using Swift.
    - To save time, we could limit our initial scope to iOS only
  - This class would be a good chance to learn something else. Options include:
    - [Xamarin](https://visualstudio.microsoft.com/xamarin/) - A C# based cross-platform mobile development framework. It allegedly lets you make native UIs per-platform with minimal platform-specific code.
    - Two separate, mutually exclusive apps for Android (Java, Kotlin) and iOS (Swift). 
    - A multitude of other new, poorly documented / supported cross-platform frameworks
  
# Set up Information
---
## The Django Backend
1. Make sure you have python 3.7 installed.
2. Install `pipenv` using `pip` to facilitate package downloads.
3. In the cloned directory for the backend (the one with `manage.py`), run `pipenv install` to grab all the dependencies.
4. Run `pipenv shell` to activate the virtual environment you just made with the above line.
5. Noodle away

## The Blazor Frontend Demo
1. Install Visual Studio 2019, version >= 16.1
2. Install [NET.Core 3.0 Preview 5](https://dotnet.microsoft.com/download/dotnet-core/3.0)
3. Install [this](https://marketplace.visualstudio.com/items?itemName=aspnet.blazor) extension to enable Blazor support.
4. Execute the following command in a powershell windows (cmd is probably fine but idk):
  `dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview5-19227-01`
5. Pop open that solution and get cracking!

## The "Actual" Fronted
???

## iOS App Setup
1. Have a Mac (or run macOS)
2. Download the Xcode IDE.
3. ???
4. Ask Ben

This procedure might differ if we roll with Xamarin for the backend, in which case you'll want Visual Studio.
---

For the mobile app client, we'll need to decide what approach we're taking. If we're doing iOS only using Swift, you're going to need a Mac (or macOS if you want to run a Hackintosh or VM) and the Xcode IDE. If we take a different approach, this will change. For example, Xamarin would just require installing the Xamarin tools in Visual Studio (I believe).
# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
---
The way things are currently swinging, we need a database-backed web API. The current play is with this one:
- [Django](https://www.djangoproject.com/) - A "batteries-included" python web-framework
  - To make coding a proper API easier, [Djano-Rest-Framework](https://www.django-rest-framework.org/) is hella nice.

For frontends, we are doing two UIs:
- A traditional web application. We are currently using [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/client), a framework for making Single-Page Applications (SPAs) using C#/.NET. We have other options though:
  - [Django?](https://docs.djangoproject.com/en/2.2/topics/templates/) - Django Templates would allow for us to create a rudimentary web-frontend, but it's unclear exactly how it would mesh with the REST API or if it is suitable for SPAs like the other options. We should research this.
  - [Angular](https://angular.io/) - A Typescript Framework for web applications; Mature and tested. Supported by Google Open Source
  - [React](https://reactjs.org/) - "A JS library for building UIs" - Supported by Facebook Open Source
  - [Vue.JS](https://vuejs.org/) - "Approachable, versatile, performant " - Newcomer with regards to these things, but it's pretty poppin on GitHub.
- A mobile app
  - Ben is most comfortable with iOS development using Swift.
    - To save time, we could limit our initial scope to iOS only
  - This class would be a good chance to learn something else. Options include:
    - [Xamarin](https://visualstudio.microsoft.com/xamarin/) - A C# based cross-platform mobile development framework. It allegedly lets you make native UIs per-platform with minimal platform-specific code.
    - Two separate, mutually exclusive apps for Android (Java, Kotlin) and iOS (Swift). 
    - A multitude of other new, poorly documented / supported cross-platform frameworks
  
# Set up Information
---
## The Django Backend
1. Make sure you have python 3.7 installed.
2. Install `pipenv` using `pip` to facilitate package downloads.
3. In the cloned directory for the backend (the one with `manage.py`), run `pipenv install` to grab all the dependencies.
4. Run `pipenv shell` to activate the virtual environment you just made with the above line.
5. Noodle away

## The Blazor Frontend Demo
1. Install Visual Studio 2019, version >= 16.1
2. Install [NET.Core 3.0 Preview 5](https://dotnet.microsoft.com/download/dotnet-core/3.0)
3. Install [this](https://marketplace.visualstudio.com/items?itemName=aspnet.blazor) extension to enable Blazor support.
4. Execute the following command in a powershell windows (cmd is probably fine but idk):
  `dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview5-19227-01`
5. Pop open that solution and get cracking!

## The "Actual" Fronted
???

## iOS App Setup
1. Have a Mac (or run macOS)
2. Download the Xcode IDE.
3. ???
4. Ask Ben

This procedure might differ if we roll with Xamarin for the backend, in which case you'll want Visual Studio.
---

For the mobile app client, we'll need to decide what approach we're taking. If we're doing iOS only using Swift, you're going to need a Mac (or macOS if you want to run a Hackintosh or VM) and the Xcode IDE. If we take a different approach, this will change. For example, Xamarin would just require installing the Xamarin tools in Visual Studio (I believe).
