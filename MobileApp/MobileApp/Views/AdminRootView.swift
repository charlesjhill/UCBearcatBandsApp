//
//  AdminRootView.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI

struct AdminRootView: View {
    
    init() {
        // HACK: Because SwiftUI doesn't seem to furnish a good way of changing the tab color...
        UITabBar.appearance().barTintColor = .red // TODO: Use UC red pantone
        UITabBar.appearance().tintColor = .white
        UITabBar.appearance().unselectedItemTintColor = .black
    }
    
    var body: some View {
        TabView {
            Text("Dashboard Placeholder")
                .font(.title)
                .tabItem({
                    Image("dashboard-icon")
                    Text("Dashboard")
                })
            InstrumentListView()
                .environmentObject(InstrumentListVM())
                .tabItem({
                    Image("instrument-icon")
                    Text("Instruments")
                })
            UniformListView()
                .environmentObject(UniformListVM())
                .tabItem({
                    Image("uniform-icon")
                    Text("Uniforms")
                })
            EnsembleListView()
                .environmentObject(EnsembleListVM())
                .tabItem({
                    Image("person-icon")
                    Text("Ensembles")
                })
        }
        .accentColor(Color.white)
    }
}

#if DEBUG
struct AdminRootView_Previews: PreviewProvider {
    static var previews: some View {
        AdminRootView()
    }
}
#endif
