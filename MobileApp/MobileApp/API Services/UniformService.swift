//
//  UniformService.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/2/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya
import Alamofire

enum UniformService {
    
    /// Shows Uniform given the number
    case showUniform(id: Int)
    
    /// Shows available Uniforms
    case showUniforms
    
    // TODO: Search for uniforms?? Backend doesn't support it yet
    
    case updateUniform(id: Int, uniform: UniformPiece)
    
    case deleteUniform(id: Int)
}

extension UniformService: TargetType {
    
    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/uniforms/")! }
    
    var path: String {
        switch self {
        case .showUniform(let id), .updateUniform(let id, _), .deleteUniform(let id):
            return "\(id)/"
        default:
            return ""
        }
        
    }
    
    var method: Moya.Method {
        switch self {
        case .showUniform, .showUniforms:
            return .get
        case .updateUniform:
            return .put
        case .deleteUniform:
            return .delete
        }
    }
    
    var sampleData: Data {
        // TODO: Reevaluate sample data?
        let sampleUniform = UniformPiece(id: 1, currentOwners: [] , previousOwners: [] , condition: .new, kind: .pants, size: "s", number: "435_old")
        let sampleUniformData = try! JSONEncoder().encode(sampleUniform)

        switch self {
        case .showUniform(let id):
            if id == 1 {return sampleUniformData } else { return Data() }
        case .showUniforms:
            return sampleUniformData
        default:
            return Data()
        }
    }
    
    var task: Task {
        switch self {
        case .showUniform, .showUniforms, .deleteUniform:
            return .requestPlain
        case .updateUniform(_, let uniform):
            return .requestParameters(parameters: uniform.toDictionary()!, encoding: JSONEncoding.default)
        }
    }
    
    var headers: [String : String]? {
        return ["Content-type": "application/json"]
    }
    
    
    
}
