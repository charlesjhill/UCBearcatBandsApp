//
//  UniformListVM.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import SwiftUI
import Moya

class UniformListVM: ListViewDelegate, ObservableObject {
    @Published var uniforms: [UniformPiece] = []
    
    let api = MoyaProvider<UniformService>()
    
    func refreshData() {
        api.request(.showUniforms) { result in
            switch result {
            case let .success(moyaResponse):
                self.uniforms = moyaResponse.parseJsonResponse() ?? []
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
            api.request(.deleteUniform(id: uniforms[index].id)) { result in
                switch result {
                case let .success(moyaResponse):
                    if moyaResponse.statusCode == 204 { self.uniforms.remove(at: index) }
                case let .failure(error):
                    print(error)
                }
            }
        }
        
    }
}
