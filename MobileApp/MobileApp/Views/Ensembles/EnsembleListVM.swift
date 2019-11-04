//
//  EnsembleListVM.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI
import Moya

class EnsembleListVM: ListViewDelegate, ObservableObject {
    @Published var ensembles: [Ensemble] = []
    
    let api = MoyaProvider<EnsembleService>()
    
    func refreshData() {
        api.request(.showEnsembles) { result in
            switch result {
            case let .success(moyaResponse):
                self.ensembles = moyaResponse.parseJsonResponse() ?? []
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
            api.request(.deleteEnsemble(id: ensembles[index].id)) { result in
                switch result {
                case let .success(moyaResponse):
                    if moyaResponse.statusCode == 204 { self.ensembles.remove(at: index) }
                case let .failure(error):
                    print(error)
                }
            }
        }
        
    }
}
