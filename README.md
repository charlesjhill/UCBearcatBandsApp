# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
---
The way things are currently swinging, we need a database-backed web API. The current play is with this one:
- [Django](https://www.djangoproject.com/) - A "batteries-included" python web-framework
  - To make coding a proper API easier, [Djano-Rest-Framework](https://www.django-rest-framework.org/) is hella nice.
  - P.S., the way the Django project is currently structured is not something I'm strongly attached to and I'm willing to move the "app" folder (`bands`) outside of the project folder (`ucbearcatbandsproject`) if we determine that'd be easier to work with.

For frontends, we are doing two UIs:
- A traditional web application. We are currently using [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/client), a framework for making Single-Page Applications (SPAs) using C#/.NET. We have other options though:
  - [Django?](https://docs.djangoproject.com/en/2.2/topics/templates/) - Django Templates would allow for us to create a rudimentary web-frontend, but it's unclear exactly how it would mesh with the REST API or if it is suitable for SPAs like the other options. We should research this.
  - [Angular](https://angular.io/) - A Typescript Framework for web applications; Mature and tested. Supported by Google Open Source
  - [React](https://reactjs.org/) - "A JS library for building UIs" - Supported by Facebook Open Source
  - [Vue.JS](https://vuejs.org/) - "Approachable, versatile, performant " - Newcomer with regards to these things, but it's pretty poppin on GitHub.
- An iOS only mobile app
  - Details about our configuration / setup are below.
  
# Set up Information
---
## The Django Backend
1. Make sure you have python 3.7 installed.
2. Install `pipenv` using `pip` to facilitate package downloads.
3. In the cloned directory for the backend (the one with `manage.py`), run `pipenv install` to grab all the dependencies.
4. Run `pipenv shell` to activate the virtual environment you just made with the above line.
5. If there isn't a `db.sqlite3` in the directory, run the following command now:  
   `python manage.py migrate`
6. Noodle away

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
Since the iOS app is really just going to be a frontend wrapper for our web API, I'll go ahead and suggest you set up a backend server. The app won't really do much if it can't ping that.

After you've done that, do the following to work on the iOS app:
1. Have a Mac (or run macOS)
2. Download the Xcode IDE.
3. Install [CocoaPods](https://cocoapods.org), used as a package manager in the same vein as `pip` for Python.
4. Inside the "MobileApp" directory, you'll find a file named `Podfile`; this specifies our dependencies. Run `pod install` in the terminal to install them.
5. Open the `MobileApp.xcworkspace` file in Xcode, and everything should be ready to go. Note that you don't use `MobileApp.xcodeproj`, it's not tied into the CocoaPods dependencies.

Ben has some lingering concerns about code signing (requires an iCloud account and he's set it up to use his), but this should more or less work. If you run into issues consult Ben.
