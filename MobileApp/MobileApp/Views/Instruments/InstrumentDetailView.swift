//
//  InstrumentDetailView.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/31/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI

struct InstrumentDetailView: View {
    @EnvironmentObject private var viewModel: InstrumentListVM
    
    @State private var kind: Int = 0
    @State private var condition: Int = 0
    @State private var make: String = ""
    @State private var model: String = ""
    @State private var serialNumber: String = ""
    @State private var assetNumber: String = ""
    @State private var tagNumber: String = ""
    private var instrument: Instrument?
    private var pageTitle: String { get { instrument == nil ? "New Instrument" : "Modify Instrument" } }
    var kinds: [String] = InstrumentKind.allCases.map { $0.rawValue }
    var conditions: [String] = AssetCondition.allCases.map { $0.rawValue }
    
    init(_ instrument: Instrument? = nil) {
        self.instrument = instrument
        
        // If we got an instrument (i.e. we're modifying an existing asset), we should really make sure the state of
        // this view matches the current information
        guard let i = instrument else { return }
        _kind = State(initialValue: kinds.firstIndex(of: i.kind.rawValue) ?? 0)
        _condition = State(initialValue: conditions.firstIndex(of: i.condition.rawValue) ?? 0)
        _make = State(initialValue: i.make)
        _model = State(initialValue: i.model)
        _serialNumber = State(initialValue: i.serialNumber)
        _assetNumber = State(initialValue: i.ucAssetNumber)
        _tagNumber = State(initialValue: i.ucTagNumber)
    }
    
    var body: some View {
        Form {
            Section(header: Text("Description")) {
                Picker(selection: $kind, label: Text("Kind")) {
                    ForEach(0 ..< kinds.count) {
                        Text(self.kinds[$0]).tag($0)
                    }
                }
                Picker(selection: $condition, label: Text("Condition")) {
                    ForEach(0 ..< conditions.count) {
                        Text(self.conditions[$0]).tag($0)
                    }
                }
            }
            // TODO: Fix alignment of edit boxes
            Section(header: Text("Branding")) {
                HStack {
                    Text("Make")
                    TextField("", text: $make)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Model")
                        .padding(.trailing)
                    TextField("", text: $model)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Serial")
                        .padding(.trailing)
                    TextField("", text: $serialNumber)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .multilineTextAlignment(.trailing)
                }
            }
            Section(header: Text("Identification")) {
                HStack {
                    Text("Tag Number")
                        .padding(.trailing)
                    TextField("", text: $tagNumber)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Asset Number")
                        .padding(.trailing)
                    TextField("", text: $assetNumber)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .multilineTextAlignment(.trailing)
                }
            }
            Button(action: constructInstrument) {
                HStack {
                    // HACK: This is the only way I could figure out how to center the text here
                    Spacer()
                    Text("Submit")
                    Spacer()
                }
            }
        }
        .padding(.top)
        .listStyle(GroupedListStyle())
        .navigationBarTitle(Text(pageTitle), displayMode: .inline)
    }
    
    private func constructInstrument() {
        let i = Instrument(id: instrument?.id ?? 0,
                           name: "",
                           condition: AssetCondition(rawValue: conditions[condition])!,
                           kind: InstrumentKind(rawValue: kinds[kind])!,
                           make: !make.isEmpty ? make : instrument?.make ?? "",
                           model: !model.isEmpty ? model : instrument?.model ?? "",
                           serialNumber: !serialNumber.isEmpty ? serialNumber : instrument?.serialNumber ?? "",
                           ucTagNumber: !tagNumber.isEmpty ? tagNumber : instrument?.ucTagNumber ?? "",
                           ucAssetNumber: !assetNumber.isEmpty ? assetNumber : instrument?.ucAssetNumber ?? "")
        if instrument == nil {
            viewModel.addInstrument(i)
        } else {
            viewModel.updateInstrument(i)
        }
    }
    
}

#if DEBUG
struct InstrumentDetailView_Previews: PreviewProvider {
    static var previews: some View {
        InstrumentDetailView(nil).environmentObject(InstrumentListVM())
    }
}
#endif
