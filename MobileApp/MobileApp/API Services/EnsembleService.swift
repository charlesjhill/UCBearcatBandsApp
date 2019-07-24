//
//  EnsembleService.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya

enum EnsembleService {
    
    case addEnsemble(_ ensemble: Ensemble)
    
    case showEnsemble(id: Int)
    
    case showEnsembles
    
    case updateEnsemble(id: Int, ensemble: Ensemble)
    
    case deleteEnsemble(id: Int)
    
}

extension EnsembleService: TargetType {
    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/ensembles/")!}
    
    var path: String {
        switch self {
        case .showEnsemble(let id), .updateEnsemble(let id, _), .deleteEnsemble(let id): return "\(id)/"
        default:
            return ""
        }
    }
    
    var method: Moya.Method {
        switch self {
        case .showEnsemble, .showEnsembles:
            return .get
        case .addEnsemble:
            return .post
        case .updateEnsemble:
            return .put
        case .deleteEnsemble:
            return .delete
           
        }
    }
    
    var sampleData: Data {
        //TODO: sample data
        return Data()
    }
    
    var task: Task {
        switch self{
        case .showEnsemble, .showEnsembles, .deleteEnsemble:
            return .requestPlain
        case .addEnsemble(let ensemble), .updateEnsemble(_, let ensemble):
        return .requestParameters(parameters: ensemble.toDictionary()!, encoding: JSONEncoding.default)
    }
    }
    
    var headers: [String : String]? {
        return ["Content-type": "application/json"]
    }
    
    
}
