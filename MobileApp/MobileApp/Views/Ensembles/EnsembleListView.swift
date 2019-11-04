//
//  EnsembleListView.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI

struct EnsembleListView: View {
    @EnvironmentObject var viewModel: EnsembleListVM
    
    var body: some View {
        NavigationView {
            List {
                ForEach (viewModel.ensembles) { ensemble in
                    NavigationLink(destination: EnsembleDetailView(ensemble: ensemble)) {
                        EnsembleRow(ensemble: ensemble)
                    }
                }
                .onDelete(perform: viewModel.deleteRow)
                // TODO: Pull to refresh appears to be unsupported in SwiftUI ScrollViews for the time being
                // https://stackoverflow.com/questions/56493660/pull-down-to-refresh-data-in-swiftui=
            }
            .navigationBarTitle(Text("Ensembles"))
        }
        .onAppear(perform: viewModel.refreshData)
    }
}

struct EnsembleRow: View {
    let ensemble: Ensemble
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(ensemble.name)
                .font(.headline)
            Text(ensemble.term)
                .font(.subheadline)
        }
    }
}

#if DEBUG
struct EnsembleListView_Previews: PreviewProvider {
    static var previews: some View {
        EnsembleListView().environmentObject(EnsembleListVM())
    }
}
#endif
