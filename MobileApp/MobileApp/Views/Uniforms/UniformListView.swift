//
//  UniformListView.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI

struct UniformListView: View {
    @EnvironmentObject var viewModel: UniformListVM
    
    var body: some View {
        NavigationView {
            List {
                ForEach (viewModel.uniforms) { uniform in
                    NavigationLink(destination: UniformDetailView(uniform: uniform)) {
                        UniformRow(uniform: uniform)
                    }
                }
                .onDelete(perform: viewModel.deleteRow)
                // TODO: Pull to refresh appears to be unsupported in SwiftUI ScrollViews for the time being
                // https://stackoverflow.com/questions/56493660/pull-down-to-refresh-data-in-swiftui=
            }
            .navigationBarTitle(Text("Uniforms"))
        }
        .onAppear(perform: viewModel.refreshData)
    }
}

struct UniformRow: View {
    let uniform: UniformPiece
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(uniform.name)
                .font(.headline)
            Text(uniform.kind.rawValue)
                .font(.subheadline)
        }
    }
}

#if DEBUG
struct UniformListView_Previews: PreviewProvider {
    static var previews: some View {
        UniformListView().environmentObject(UniformListVM())
    }
}
#endif
