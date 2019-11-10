//
//  InstrumentListView.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/31/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI

struct InstrumentListView: View {
    @EnvironmentObject var viewModel: InstrumentListVM
    
    var body: some View {
        NavigationView {
            List {
                ForEach (viewModel.instruments) { instrument in
                    NavigationLink(destination: InstrumentDetailView(instrument)) {
                        InstrumentRow(instrument: instrument)
                    }
                }
                .onDelete(perform: viewModel.deleteRow)
                // TODO: Pull to refresh appears to be unsupported in SwiftUI ScrollViews for the time being
                // https://stackoverflow.com/questions/56493660/pull-down-to-refresh-data-in-swiftui=
            }
            .navigationBarTitle(Text("Instruments"))
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .onAppear(perform: viewModel.refreshData)
    }
}

struct InstrumentRow: View {
    let instrument: Instrument
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(instrument.name)
                .font(.headline)
            Text(instrument.kind.rawValue)
                .font(.subheadline)
        }
    }
}

#if DEBUG
struct InstrumentListView_Previews: PreviewProvider {
    static var previews: some View {
        InstrumentListView().environmentObject(InstrumentListVM())
    }
}
#endif
