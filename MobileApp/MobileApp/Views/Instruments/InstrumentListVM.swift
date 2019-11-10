//
//  InstrumentListVM.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/31/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI
import Moya

class InstrumentListVM: ListViewDelegate, ObservableObject {
    @Published var instruments: [Instrument] = []
    
    let api = MoyaProvider<InstrumentService>()
    
    func refreshData() {
        api.request(.showInstruments) { result in
            switch result {
            case let .success(moyaResponse):
                self.instruments = moyaResponse.parseJsonResponse() ?? []
            case let .failure(error):
                print(error)
            }
        }
    }
    
    func addInstrument(_ instrument: Instrument) {
        api.request(.addInstrument(instrument)) { result in
            switch result {
            case let .success(moyaResponse):
                switch moyaResponse.statusCode {
                case 201:
                    print("Instrument added")
                default:
                    print("Request failed")
                }
            case let .failure(error):
                print(error)
            }
        }
    }
    
    func updateInstrument(_ instrument: Instrument) {
        api.request(.updateInstrument(id: instrument.id, instrument: instrument)) { result in
            switch result {
            case let .success(moyaResponse):
                switch moyaResponse.statusCode {
                case 200:
                    self.refreshData()
                default:
                    print("Request failed")
                }
            case let .failure(error):
                print(error)
            }
        }
    }
    
    func deleteRow(at indices: IndexSet) {
        // We shouldn't need to (in practice) worry about the index set containing more than one value, but since it's
        // fairly simple to do, we'll go ahead and support "bulk" deletion. A bulk deletion endpoint on the API could be
        // nice if this became a problem.
        var iterator = indices.makeIterator()
        while let index = iterator.next() {
            api.request(.deleteInstrument(id: instruments[index].id)) { result in
                switch result {
                case let .success(moyaResponse):
                    if moyaResponse.statusCode == 204 { self.instruments.remove(at: index) }
                case let .failure(error):
                    print(error)
                }
            }
        }
        
    }
}
